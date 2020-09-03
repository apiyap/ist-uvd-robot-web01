import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../Frame";
import ControlSidebar from "./ControlSidebar";

export default function Plan() {
  return (
    <>
      <Frame>
        <div className="container-fluid">
          <h1>Robot Schedule</h1>
        </div>
      </Frame>
      <ControlSidebar />
    </>
  );
}
