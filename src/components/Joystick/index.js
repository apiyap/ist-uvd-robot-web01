import React, {  useRef, useEffect , useCallback} from "react";
import nipplejs from "nipplejs";
import { useDispatch , useSelector } from "react-redux";
import * as ROSLIB from "roslib";
import {  Ros } from "../../features/Ros/rosSlice";
import Draggable from "react-draggable";
import {
  getShowJoystick,
  getEnabledJoystick,
  getRelocateJoystick,
} from "../../features/joystickSlice";
import { getVelScale, getAngScale } from "../../features/joystickSlice";


const cmdVel = new ROSLIB.Topic({
  ros: Ros,
  name: "/cmd_vel",
  messageType: "geometry_msgs/Twist",
});

// linear x and y movement and angular z movement
var x = 0;
var y = 0;
var z = 0;
// used to check for changes in speed
var oldX = x;
var oldY = y;
var oldZ = z;
function SendCmdVel(sx, sy, sz) {
  var twist = new ROSLIB.Message({
    angular: {
      x: 0,
      y: 0,
      z: sz,
    },
    linear: {
      x: sx,
      y: sy,
      z: sz,
    },
  });
  //console.log(twist);
  cmdVel.publish(twist);
}
function checkCmdVelChanged() {
  // check for changes
  if (oldX !== x || oldY !== y || oldZ !== z) {
    oldX = x;
    oldY = y;
    oldZ = z;
    SendCmdVel(x, y, z);
  }
}

/* var cmdVelScale = 0.15;
var cmdAngScale = 0.15; */


export default function Joystick(props) {
  const joyInput = useRef(null);
  const joyRef = useRef(null);
  const dispatch = useDispatch();
  const showJoy = useSelector((state) => getShowJoystick(state));
  const enableJoy = useSelector((state) => getEnabledJoystick(state));
  const relocateJoy = useSelector((state) => getRelocateJoystick(state));

  const cmdVelScale = useSelector((state) => getVelScale(state));
  const cmdAngScale = useSelector((state) => getAngScale(state));

  //let joystick = null;
  const  CreateJoy = useCallback( () => {
    if (joyRef.current !== null) joyRef.current.destroy();

    const options = {
      zone: document.getElementById("zone_joystick"),
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "green",
      size: 200,
      lockX: !enableJoy,
      lockY: !enableJoy,
    };
    joyRef.current = nipplejs.create(options);
    joyRef.current
      .on("end", function (evt, data) {
        // if($('#enabled_joystick').is(':checked'))
        // {
        x = 0;
        z = 0;
        checkCmdVelChanged();
        // }
      })
      .on("move", function (evt, data) {
        //console.log(data.vector);//{x: 0, y: 0.6966665649414062} //forward, backward
        // if($('#enabled_joystick').is(':checked'))
        // {
        x = data.vector.y * cmdVelScale*0.01;
        z = -1 * data.vector.x * cmdAngScale*0.01;
        checkCmdVelChanged();
        // }
      });
  },[cmdAngScale,cmdVelScale,enableJoy])

  useEffect(() => {
    CreateJoy();
  }, [dispatch, CreateJoy]);

  function OnStopDrag() {
    CreateJoy();
  }

  return (
    <Draggable onStop={OnStopDrag} disabled={!relocateJoy}>
      <div
        className="joystick"
        style={{ width: 200, height: 200, display: showJoy ? "block" : "none" }}
      >
        <div id="zone_joystick" ref={joyInput}></div>
      </div>
    </Draggable>
  );
}
