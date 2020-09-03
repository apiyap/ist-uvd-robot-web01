import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../Frame";
import ControlSidebar from "./ControlSidebar";

export default function Options() {
  return (
    <>
      <Frame>
        <div class="container-fluid">
          <h1>Robot Options</h1>
        </div>
      </Frame>
      <ControlSidebar />
    </>
  );
}
