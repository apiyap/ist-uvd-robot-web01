import React from "react";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="float-right d-none d-sm-block">
        <b>Version</b> 1.0.0
      </div>
      <strong>
      Copyright © 2020 - 2022{" "} <a
              href="http://www.interface.co.th"
              target="_blank"
              className="text-black"
              rel="noopener noreferrer"
            >
              Interface Systect Co.,LTD.
            </a>
      </strong>{" "}
      All rights reserved.
    </footer>
  );
}
