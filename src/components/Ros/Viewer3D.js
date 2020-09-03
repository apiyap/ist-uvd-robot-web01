import React, { useRef, forwardRef,useImperativeHandle, useEffect, useCallback } from "react";
import * as ROS3D from "ros3d";
// import * as ROSLIB from "roslib";
import { useDispatch } from "react-redux";

export const  Viewer3D = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const viewRef = useRef(null);

  const WindowSize = useCallback(() => {
    if (viewRef.current !== null) {
      viewRef.current.resize(window.innerWidth, window.innerHeight);
    }
  }, [viewRef]);
  useEffect(() => {
    if (viewRef.current === null ) {
      // Create the main viewRef.current.
      console.log("Create default viewRef.current.");

      viewRef.current = new ROS3D.Viewer({
        divID: "ros-viewers",
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
      });
    }

    window.addEventListener("resize", WindowSize);
    WindowSize();
    return () => {
      window.removeEventListener("resize", WindowSize);
    };
  }, [dispatch, WindowSize]);



  useImperativeHandle(ref, () => ({

    getAlert() {
      alert("getAlert from Viewer");
    },
    getCurrent(){
        return viewRef.current;
    },
    getScene()
    {
        return viewRef.current.scene;
    }

  }));

  return <div id="ros-viewers"></div>;
});
