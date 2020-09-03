import React, { useState, useRef, useEffect } from "react";

import "../../scss/robot-home.scss";

import {
  getParams,
  getLeftMenuOpen,
  setLeftMenuOpen,
  getControlBarOpen,
  setControlBarOpen,
} from "../../features/appSlice";
import { useSelector, useDispatch } from "react-redux";

import TopNavbar from "./TopNavbar";
import MainSidebar from "./MainSidebar";
//import ContentWrapper from "./ContentWrapper";
import Footer from "./Footer";
import ControlSidebar from "./ControlSidebar";
import Robot from "../Ros";

const ClassName = {
  COLLAPSED: "sidebar-collapse",
  OPEN: "sidebar-open",
  CLOSED: "sidebar-closed",
  CONTROL_SIDEBAR_ANIMATE: "control-sidebar-animate",
  CONTROL_SIDEBAR_OPEN: "control-sidebar-open",
  CONTROL_SIDEBAR_PUSH_SLIDE: "control-sidebar-push-slide",
  CONTROL_SIDEBAR_SLIDE_SHOW: "control-sidebar-slide-show",
  CONTROL_SIDEBAR_SLIDE_HIDE: "control-sidebar-slide-hide",
};

export default function RobotHome(props) {
  const [robotCenter, setRobotCenter] = useState(true);

  const dispatch = useDispatch();

  const params = useSelector((state) => getParams(state));
  const leftMenu = useSelector((state) => getLeftMenuOpen(state));
  const controlBarOpen = useSelector((state) => getControlBarOpen(state));

  const robotRef = useRef();
  useEffect(() => {
    robotRef.current.setCenterView(robotCenter);
  }, [robotRef, robotCenter]);

  //   useEffect(() => {
  // //sidebar-open
  // showCloseBtn = document.body.classList.contains("sidebar-open")

  //   },[showCloseBtn]);

  function expand() {
    console.log("expand");
    dispatch(setLeftMenuOpen(true));

    if (params.window.autoCollapseSize) {
      if (window.innerWidth <= params.window.autoCollapseSize) {
        document.body.classList.add(ClassName.OPEN);
      }
    }
    document.body.classList.remove(ClassName.COLLAPSED);
    document.body.classList.remove(ClassName.CLOSED);
  }

  function collapse() {
    console.log("collapse");
    dispatch(setLeftMenuOpen(false));
    if (params.window.autoCollapseSize) {
      if (window.innerWidth <= params.window.autoCollapseSize) {
        document.body.classList.remove(ClassName.OPEN);
        document.body.classList.remove(ClassName.CLOSED);
      }
    }
    document.body.classList.add(ClassName.COLLAPSED);
  }

  function toggleLeftMenubar(e) {
    // setShowComment(false);
    // setShowNotify(false);
    console.log(leftMenu);
    if (!leftMenu) {
      expand();
    } else {
      collapse();
    }
  }

  function controlbarCollapse() {
    dispatch(setControlBarOpen(false));
    if (params.window.controlsidebarSlide) {
      document.body.classList.remove(ClassName.CONTROL_SIDEBAR_SLIDE_SHOW);
      document.body.classList.add(ClassName.CONTROL_SIDEBAR_SLIDE_HIDE);
    } else {
      document.body.classList.remove(ClassName.CONTROL_SIDEBAR_OPEN);
    }
  }

  function controlbarShow() {
    // Collapse the control sidebar
    dispatch(setControlBarOpen(true));

    if (params.window.controlsidebarSlide) {
      document.body.classList.remove(ClassName.CONTROL_SIDEBAR_SLIDE_HIDE);
      document.body.classList.add(ClassName.CONTROL_SIDEBAR_SLIDE_SHOW);
    } else {
      document.body.classList.add(ClassName.CONTROL_SIDEBAR_OPEN);
    }
  }

  function toggleControlbar() {
    console.log(controlBarOpen);
    const shouldClose =
      document.body.classList.contains(ClassName.CONTROL_SIDEBAR_SLIDE_SHOW) ||
      document.body.classList.contains(ClassName.CONTROL_SIDEBAR_OPEN);
    if (shouldClose) {
      // Close the control sidebar
      console.log("controlbarCollapse");
      controlbarCollapse();
    } else {
      // Open the control sidebar
      console.log("controlbarShow");
      controlbarShow();
    }
  }

  function handleMenuClick(e) {
    console.log(e);

    switch (e) {
      case "leftmenu":
        toggleLeftMenubar();
        break;
      case "controlbar":
        toggleControlbar();
        break;
      case "disconnected":
        break;
      default:
        break;
    }
  }

  function handleCloseLeftMenu() {
    if (document.body.classList.contains(ClassName.OPEN)) {
      collapse();
    }
  }

  return (
    <>
      <TopNavbar logout={props.logout} menuClick={handleMenuClick} />
      <MainSidebar closeMenuClick={handleCloseLeftMenu} />
      <div className="content-wrapper bg-gray">
        <section className="content">
          <Robot ref={robotRef} />
        </section>
      </div>
      <Footer />
      <ControlSidebar
        robotCeneter={robotCenter}
        onRobotCenter={(e) => {
          setRobotCenter(e);
        }}
      />
    </>
  );
}
