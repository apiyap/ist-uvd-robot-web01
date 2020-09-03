import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../../Frame";
import ControlSidebar from "./ControlSidebar";

export default function CreateMap() {
  return (
    <>
      <Frame>
        <div className="container-fluid">
          <h1>Create Map</h1>
        </div>
      </Frame>
      <ControlSidebar />
    </>
  );
}
