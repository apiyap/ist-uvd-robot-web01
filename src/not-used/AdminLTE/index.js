import React, {
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getStatusLogin,
  getAuthUser,
  authUser,
  authLogout,
  authRefresh,
} from "../../features/Auth/AuthSlice";
import "./custom.scss";

import { getParams, updateWindowSize } from "../../features/appSlice";

import TopNavbar from "./TopNavbar";
import MainSidebar from "./MainSidebar";
import ContentWrapper from "./ContentWrapper";
import Footer from "./Footer";
import ControlSidebar from "./ControlSidebar";

const ClassName = {
  COLLAPSED: "sidebar-collapse",
  OPEN: "sidebar-open",
  CLOSED: "sidebar-closed",
  CONTROL_SIDEBAR_ANIMATE: "control-sidebar-animate",
  CONTROL_SIDEBAR_OPEN: "control-sidebar-open",
  CONTROL_SIDEBAR_SLIDE: "control-sidebar-slide-open",
  CONTROL_SIDEBAR_SLIDE_CLOSE: "control-sidebar-slide-close",
};

function AdminLTE(props) {
  const timerRef = useRef(null);

  let history = useHistory();
  const dispatch = useDispatch();
  //let [timerRefresh, setTimerRefresh] = useState(null);
  const status = useSelector((state) => getStatusLogin(state));
  const user = useSelector((state) => getAuthUser(state));
  const params = useSelector((state) => getParams(state));

  function getWindowSize() {
    const wSize = { width: window.innerWidth, height: window.innerHeight };
    dispatch(updateWindowSize(wSize));
    //console.log(wSize)
    autoCollapse(true);
  }

  const handleRefresh = useCallback(() => {
    dispatch(authRefresh({ data: user }));
    console.log("refresh");
  }, [dispatch, user]);

  const getUserData = useCallback(async () => {
    try {
      const resultAction = await dispatch(authUser());
      //unwrapResult(resultAction);
      if (resultAction.payload === null) {
        // console.log(resultAction.payload);
        history.push("/login");
      } else if (resultAction.payload.error) {
        console.log("Error");
        console.log(resultAction.payload);
      } else {
        const timestamp = user.time * 1000;
        if (!isNaN(timestamp)) {
          // console.log(user.time);
          // console.log(timestamp);
          console.log(
            new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(timestamp)
          );

          if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }

          const timeout = (user.expires_in - 600) * 1000; //50 min
          //console.log(timeout);
          timerRef.current = setTimeout(() => {
            console.log("auto token refresh");
            handleRefresh();
          }, timeout);
        }
      }
    } catch (err) {
      console.error("Failed to save the post: ", err);
    } finally {
    }
  }, [dispatch, history, user, handleRefresh]);

  useEffect(() => {
    console.log("useEffect");
    if (document.body.classList.contains("hold-transition")) {
      document.body.classList.remove("hold-transition");
    }
    if (document.body.classList.contains("lockscreen")) {
      document.body.classList.remove("lockscreen");
    }
    if (!document.body.classList.contains("sidebar-mini")) {
      document.body.classList.add("sidebar-mini");
    }
    if (!document.body.classList.contains("layout-navbar-fixed")) {
      document.body.classList.add("layout-navbar-fixed");
    }
    if (!document.body.classList.contains(ClassName.CONTROL_SIDEBAR_SLIDE_CLOSE)) {//
      document.body.classList.add(ClassName.CONTROL_SIDEBAR_SLIDE_CLOSE);
    }

    getUserData();
    window.addEventListener("resize", getWindowSize);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      window.removeEventListener("resize", getWindowSize);
    };
  }, [getUserData]); // passing an empty array as second argument triggers the callback in useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour

  const handleLogout = useCallback(
    (e) => {
      e.preventDefault();
      console.log("logout");
      try {
        const resultAction = dispatch(authLogout());
        unwrapResult(resultAction);
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        history.push("/login");
      } catch (err) {
        console.error("Failed to save the post: ", err);
      } finally {
      }
    },
    [dispatch, history]
  );

  function expand() {
    if (params.window.autoCollapseSize) {
      if (window.innerWidth <= params.window.autoCollapseSize) {
        document.body.classList.add(ClassName.OPEN);
      }
    }
    //$(Selector.BODY).removeClass(ClassName.COLLAPSED).removeClass(ClassName.CLOSED)
    document.body.classList.remove(ClassName.COLLAPSED);
    document.body.classList.remove(ClassName.CLOSED);
    // if(this._options.enableRemember) {
    //   localStorage.setItem(`remember${EVENT_KEY}`, ClassName.OPEN)
    // }
    // const shownEvent = $.Event(Event.SHOWN)
    // $(this._element).trigger(shownEvent)
  }

  function collapse() {
    if (params.window.autoCollapseSize) {
      if (window.innerWidth <= params.window.autoCollapseSize) {
        //$(Selector.BODY).removeClass(ClassName.OPEN).addClass(ClassName.CLOSED)
        document.body.classList.remove(ClassName.OPEN);
        document.body.classList.remove(ClassName.CLOSED);
      }
    }
    // $(Selector.BODY).addClass(ClassName.COLLAPSED)
    document.body.classList.add(ClassName.COLLAPSED);
    // if(this._options.enableRemember) {
    //   localStorage.setItem(`remember${EVENT_KEY}`, ClassName.COLLAPSED)
    // }
    // const collapsedEvent = $.Event(Event.COLLAPSED)
    // $(this._element).trigger(collapsedEvent)
  }

  function toggle() {
    if (!document.body.classList.contains(ClassName.COLLAPSED)) {
      console.log("collapse");
      collapse();
    } else {
      console.log("expand");
      expand();
    }
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

  function handleOverlayClick() {
    if (document.body.classList.contains(ClassName.OPEN)) {
      collapse();
    }
  }

  function controlbarCollapse() {
    // Show the control sidebar
    if (params.window.controlsidebarSlide) {

      document.body.classList.remove(ClassName.CONTROL_SIDEBAR_SLIDE);
      document.body.classList.add(ClassName.CONTROL_SIDEBAR_SLIDE_CLOSE);

    } else {
      document.body.classList.remove(ClassName.CONTROL_SIDEBAR_OPEN);
    }
  }

  function controlbarShow() {
    // Collapse the control sidebar
    if (params.window.controlsidebarSlide) {

      document.body.classList.remove(ClassName.CONTROL_SIDEBAR_SLIDE_CLOSE);
      document.body.classList.add(ClassName.CONTROL_SIDEBAR_SLIDE);
        
    } else {
      document.body.classList.add(ClassName.CONTROL_SIDEBAR_OPEN);
    }
  }

  function controlbarToggle() {
    const shouldClose = document.body.classList.contains(ClassName.CONTROL_SIDEBAR_SLIDE) ||
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

  return (
    <div onClickCapture={handleOverlayClick}>
      <TopNavbar
        toggleMenuClick={toggle}
        toggleControlbarClick={controlbarToggle}
      />
      <MainSidebar />
      <ContentWrapper />
      <Footer />
      <ControlSidebar />
    </div>
  );
}

export default AdminLTE;
