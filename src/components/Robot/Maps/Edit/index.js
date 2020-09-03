import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../../Frame";
import ControlSidebar from "./ControlSidebar";

export default function EditMap() {
  return (
    <>
      <Frame>
        <div className="container-fluid">
          <h1>Edit map</h1>
        </div>
      </Frame>
      <ControlSidebar />
    </>
  );
}
