import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../Frame";
import ControlSidebar from "./ControlSidebar";
import { Editor } from "../../Editor";

export default function Maps() {


  return (
    <>
      <Frame>
        <div class="container-fluid">
        <Editor className="col-12" />
        </div>
      </Frame>
      <ControlSidebar />
    </>
  );
}
