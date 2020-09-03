import React, { useState, useRef, useEffect, useCallback } from "react";

import Frame from "../../Frame";
import ControlSidebar from "./ControlSidebar";
import Robot2D from "../../../Ros/Robot2D";

function Manual(props) {
  const [robotCenter, setRobotCenter] = useState(true);
  const [robotAutoView, setRobotAutoView] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);

  const robotRef = useRef();

  useEffect(() => {
    robotRef.current.setCenterView(robotCenter);
    robotRef.current.setAutoRotateView(robotAutoView);
    // return () => {
    //   // Anything in here is fired on component unmount.
    // };
  }, [robotRef, /* robotCenter */]);

  function onRobotAutoCenter(e){
    setRobotCenter(e);
    robotRef.current.setCenterView(e);
  }
  function onRobotAutoRotate(e){
    setRobotAutoView(e);
    robotRef.current.setAutoRotateView(e);

  }
  function onRobotShowToolbar(e){
    setShowToolbar(e);
    robotRef.current.setShowToolbar(e);
  }
  return (
    <>
      <Frame>
        <Robot2D
          ref={robotRef}
          showToolbar = {showToolbar}
          // Grid={true}
          // MapGrid={true}
          // Model={true}
          // Laser={true}
          // Arrow={true}
        />
      </Frame>
      <ControlSidebar
        robotCeneter={robotCenter}
        robotAutoView={robotAutoView}
        showToolbar = {showToolbar}

        onRobotCenter={onRobotAutoCenter}
        onRobotRotate={onRobotAutoRotate}
        onShowToolbar={onRobotShowToolbar}

      />
    </>
  );
}


export default Manual;