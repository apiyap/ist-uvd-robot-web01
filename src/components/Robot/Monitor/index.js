import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../Frame";
import ControlSidebar from "./ControlSidebar";

export default function Monitor() {
  return (
    <>
      <Frame>
        <div class="container-fluid">
          <h1>Robot Monitor</h1>
        </div>
      </Frame>
      <ControlSidebar />
    </>
  );
}
