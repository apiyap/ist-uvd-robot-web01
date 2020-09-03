import React, { useState, useRef, useEffect, useCallback } from "react";

import "../../scss/robot-home.scss";
import { Auth } from "../Auth";

import {
  getParams,
  getLeftMenuOpen,
  setLeftMenuOpen,
  getControlBarOpen,
  setControlBarOpen,
  updateFrameSize,
} from "../../features/appSlice";


import { useSelector, useDispatch } from "react-redux";

import TopNavbar from "./TopNavbar";
import MainSidebar from "./MainSidebar";
import Footer from "./Footer";

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

export default function Frame(props) {
  // const [robotCenter, setRobotCenter] = useState(true);
  const viewRef = useRef(null);
  const authRef = useRef();
  const [viewWidth, setViewWidth] = useState(window.innerWidth);
  const [viewHeight, setViewHeight] = useState(window.innerHeight);

  const dispatch = useDispatch();

  const params = useSelector((state) => getParams(state));
  const leftMenu = useSelector((state) => getLeftMenuOpen(state));
  const controlBarOpen = useSelector((state) => getControlBarOpen(state));

  // const robotRef = useRef();
  // useEffect(() => {
  //   robotRef.current.setCenterView(robotCenter);
  // }, [robotRef, robotCenter]);

  function expand() {
    //console.log("expand");
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
    //console.log("collapse");
    dispatch(setLeftMenuOpen(false));
    if (params.window.autoCollapseSize) {
      if (window.innerWidth <= params.window.autoCollapseSize) {
        document.body.classList.remove(ClassName.OPEN);
        document.body.classList.remove(ClassName.CLOSED);
      }
    }
    document.body.classList.add(ClassName.COLLAPSED);
  }

  function autoCollapse(resize = false) {
    if (params.window.autoCollapseSize) {
      if (window.innerWidth <= params.window.autoCollapseSize) {
        if (!document.body.classList.contains(ClassName.OPEN)) {
          collapse();
        }
      } else if (resize == true) {
        if (document.body.classList.contains(ClassName.OPEN)) {
          //$(Selector.BODY).removeClass(ClassName.OPEN)
          document.body.classList.remove(ClassName.OPEN);
        } else if (document.body.classList.contains(ClassName.CLOSED)) {
          expand();
        }
      }
    }
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
      //console.log("controlbarCollapse");
      controlbarCollapse();
    } else {
      // Open the control sidebar
      //console.log("controlbarShow");
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
      case "logout":
        handleLogout();
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
  function handleLogout(e) {
    if (e) e.preventDefault();
    authRef.current.logout();
  }

  const WindowSize = useCallback(() => {
    if (viewRef.current !== null) {
      setViewWidth(viewRef.current.offsetWidth);
      setViewHeight(viewRef.current.offsetHeight);
      //console.log("Frame H:" + viewRef.current.offsetHeight);
      dispatch( updateFrameSize({width:viewRef.current.offsetWidth , height: viewRef.current.offsetHeight} ))
    }
  }, [viewRef,dispatch,updateFrameSize]);

  useEffect(() => {
    if (document.body.classList.contains("hold-transition")) {
      document.body.classList.remove("hold-transition");
    }
    if (document.body.classList.contains("lockscreen")) {
      document.body.classList.remove("lockscreen");
    }
    if (!document.body.classList.contains("control-sidebar-slide-hide")) {
      document.body.classList.add("control-sidebar-slide-hide");
    }

    autoCollapse();

    window.scrollTo(0, 0);

    window.addEventListener("resize", WindowSize);
    WindowSize();
    return () => {
      window.removeEventListener("resize", WindowSize);
    };
  }, [autoCollapse]);

  return (
    <>
      <Auth ref={authRef} />
      <TopNavbar menuClick={handleMenuClick} />
      <MainSidebar closeMenuClick={handleCloseLeftMenu} />
      <div ref={viewRef} className="content-wrapper">
        <section className="content">{props.children}</section>
      </div>
      <Footer />
    </>
  );
}
