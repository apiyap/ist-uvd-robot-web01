import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../../Frame";
import ControlSidebar from "./ControlSidebar";

export default function Dock() {
  return (
    <>
      <Frame>
        <div class="container-fluid">
          <h1>Go to Docking station</h1>
        </div>
      </Frame>
      <ControlSidebar />
    </>
  );
}
