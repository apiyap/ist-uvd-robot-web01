import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../Frame";
import ControlSidebar from "./ControlSidebar";
import Robot3D from "../../Ros/Robot3D";

export default function Model(props) {
  return (
    <>
      <Frame>
        <Robot3D Model={true}  />
      </Frame>
      <ControlSidebar />
    </>
  );
}
