import React from "react"; //useEffect //useState,
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export default function ControlSidebar(props) {

  return (
    <OverlayScrollbarsComponent>
      <aside className="control-sidebar control-sidebar-dark">
        <div>
          <h6>Control Sidebar</h6>
        </div>
      </aside>
    </OverlayScrollbarsComponent>
  );
}
