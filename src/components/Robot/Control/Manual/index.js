import React, { useState, useRef, useEffect, useCallback } from "react";

import Frame from "../../Frame";
import ControlSidebar from "./ControlSidebar";
import Robot3D from "../../../Ros/Robot3D";

function Manual(props) {
  const [robotCenter, setRobotCenter] = useState(true);
  const robotRef = useRef();

  useEffect(() => {
    robotRef.current.setCenterView(robotCenter);
    // return () => {
    //   // Anything in here is fired on component unmount.
    // };
  }, [robotRef, robotCenter]);

  return (
    <>
      <Frame>
        <Robot3D
          ref={robotRef}
          Grid={true}
          MapGrid={true}
          Model={true}
          Laser={true}
          Arrow={true}
        />
      </Frame>
      <ControlSidebar
        robotCeneter={robotCenter}
        onRobotCenter={(e) => {
          setRobotCenter(e);
          robotRef.current.setCenterView(e);
        }}
      />
    </>
  );
}


export default Manual;