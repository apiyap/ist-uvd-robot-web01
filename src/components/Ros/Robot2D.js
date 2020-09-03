import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";

//import * as ROS2D from "ros2d";
//var ROS2D = require('ros2d');

import * as ROSLIB from "roslib";
import { getAuthUser } from "../../features/Auth/AuthSlice";
import {
  getIsConnected,
  updateConnected,
  rosConnect,
  Ros,
} from "../../features/Ros/rosSlice";



import { useSelector, useDispatch } from "react-redux";
import  {Viewer2D}  from "./Viewer2D";
import Joystick from "../Joystick";
import WebCam from "../WebCam";



const Robot2D = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const viewRef = useRef();
  const user = useSelector((state) => getAuthUser(state));
  const rosConnected = useSelector((state) => getIsConnected(state));


  useEffect(() => {
    // Connect to ROS.

    console.log("ROS:" + Ros.isConnected);

    if (!Ros.isConnected) dispatch(rosConnect(user));
    //let scene = viewRef.current.getScene();

    if (Ros.isConnected) {

 

      Ros.on("close", function (e) {
        console.log("Connection to websocket server closed.");
        dispatch(updateConnected(false));
        window.location.reload(); //CLEAR
      });
    }

    console.log(Ros);
  }, [dispatch, user, rosConnected, updateConnected]);

  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Robot");
    },
    setCenterView(v) {
      if(viewRef.current)
      viewRef.current.setCenterView(v);
    },
    setAutoRotateView(v) {
      if(viewRef.current)
      viewRef.current.setAutoRotate(v);
    },
    setShowToolbar(v){
      if(viewRef.current)
      viewRef.current.setToolbar(v);
    },

  }));

  return (
    <>
      <Viewer2D ref={viewRef}  />
      {/* <h2>Robot 2D</h2> */}
      <Joystick />
      <WebCam />
    </>
  );
});

Robot2D.defaultProps = {
  Grid: false,
  MapGrid: false,
  Model: false,
};

export default Robot2D;
