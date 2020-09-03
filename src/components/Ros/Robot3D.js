import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import * as ROS3D from "ros3d";
import * as ROSLIB from "roslib";
import { getAuthUser } from "../../features/Auth/AuthSlice";
import {
  getIsConnected,
  updateConnected,
  rosConnect,
  Ros,
} from "../../features/Ros/rosSlice";

import { useSelector, useDispatch } from "react-redux";
import { Viewer3D } from "./Viewer3D";
import Joystick from "../Joystick";
import WebCam from "../WebCam";

let robotCeneter = true;

const Robot3D = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const viewRef = useRef();
  const user = useSelector((state) => getAuthUser(state));
  const rosConnected = useSelector((state) => getIsConnected(state));

  var tf = new ROSLIB.Transform();
  function applyCenter() {
    // apply the transform
    // console.log(viewRef.current.getCurrent())
    if(viewRef.current===null)return;

    var poseTransformed = new ROSLIB.Pose(
      viewRef.current.getCurrent().camera.position
    );
    poseTransformed.applyTransform(tf);
    viewRef.current
      .getCurrent()
      .cameraControls.center.set(
        poseTransformed.position.x,
        poseTransformed.position.y,
        poseTransformed.position.z
      );
    viewRef.current
      .getCurrent()
      .cameraControls.camera.quaternion.set(
        poseTransformed.orientation.x,
        poseTransformed.orientation.y,
        poseTransformed.orientation.z,
        poseTransformed.orientation.w
      );
    viewRef.current.getCurrent().cameraControls.update();
  }

  function getRobotPosition(msg) {
    //console.log("robot center:" + robotCeneter);
    tf = new ROSLIB.Transform(msg);

    if (robotCeneter === true) {
      applyCenter();
    }
  }

  useEffect(() => {
    // Connect to ROS.
     
    console.log("ROS:"+ Ros.isConnected);

    if (!Ros.isConnected) dispatch(rosConnect(user));
    let scene = viewRef.current.getScene();

    if (Ros.isConnected) {
      

      if (props.MapGrid === true) {
        const gridClient = new ROS3D.OccupancyGridClient({
          ros: Ros,
          rootObject: scene,
          continuous: true,
        });
      }

      if (props.Grid === true) {
        // Add a grid.
        const ros3dGrid = new ROS3D.Grid();
        viewRef.current.getCurrent().addObject(ros3dGrid);
      }

      // Setup a client to listen to TFs.
      const tfClient = new ROSLIB.TFClient({
        ros: Ros,
        angularThres: 0.01,
        transThres: 0.01,
        rate: 10.0,
        fixedFrame: "/map",
      });
      tfClient.subscribe("/base_link", getRobotPosition);

      if (props.Model === true) {
        // Setup the URDF client.
        const urdfClient = new ROS3D.UrdfClient({
          ros: Ros,
          tfClient: tfClient,
          path: "http://" + window.location.hostname + ":8080/",
          rootObject: scene,
        });
      }

      if (props.Laser === true) {
        const laserScan = new ROS3D.LaserScan({
          ros: Ros,
          topic: "/scan",
          tfClient: tfClient,
          rootObject: scene,
          material: { size: 0.05, color: 0xff00ff },
        });
      }

      if (props.Arrow === true) {
        const robotArrow = new ROS3D.Arrow();
        robotArrow.setColor(0xff0000);

        const arrowNode = new ROS3D.SceneNode({
          tfClient: tfClient,
          frameID: "/base_link",
          object: robotArrow,
        });
        scene.add(arrowNode);
      }

      Ros.on("close", function (e) {
        console.log("Connection to websocket server closed.");
        dispatch(updateConnected(false));
        window.location.reload(); //CLEAR
      });


    }

    console.log(Ros);
    console.log(scene);


    return()=>{
      //Ros.close();
    }

  }, [dispatch, user, rosConnected, updateConnected]);

  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Robot");
    },
    setCenterView(v) {
      robotCeneter = v;
      if (v) {
        applyCenter();
      }
    },
  }));

  return (
    <>
      <Viewer3D ref={viewRef} />
      <Joystick />
      <WebCam />
    </>
  );
});

Robot3D.defaultProps = {
  Grid: false,
  MapGrid: false,
  Model: false,
};

export default Robot3D;
