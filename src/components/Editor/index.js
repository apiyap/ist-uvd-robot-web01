import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from "react";
import { fabric } from "fabric";

import { useSelector, useDispatch } from "react-redux";

export const Editor = forwardRef((props, ref) => {


  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const viewRef = useRef(null);


  const WindowSize = useCallback(() => {
    if (viewRef.current !== null) {
      // setViewWidth(viewRef.current.offsetWidth )
      // setViewHeight(viewRef.current.offsetHeight )
      if (canvasRef.current !== null) {
        canvasRef.current.setWidth(viewRef.current.offsetWidth);
        // canvasRef.current.setHeight(frame.height-20);
      }
    }
  }, [canvasRef, viewRef]);

  useEffect(() => {
    // Create the main canvasRef.current.
    //console.log("Create default canvasRef.current.");
    if (canvasRef.current === null) {
      canvasRef.current = new fabric.Canvas("canvas");
      var rect = new fabric.Rect({
        top: 100,
        left: 100,
        width: 60,
        height: 70,
        fill: "red",
      });
      canvasRef.current.add(rect);
    }

    window.addEventListener("resize", WindowSize);

    WindowSize();

    if (props.readonly === true) {
      canvasRef.current.selection = false;
      canvasRef.current.forEachObject(function (o) {
        o.selectable = false;
      });
    }
    return () => {
      window.removeEventListener("resize", WindowSize);
    };
  }, [dispatch, WindowSize, canvasRef]);

  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Viewer");
    },
    // getCurrent(){
    //     return canvasRef.current;
    // },
    // getScene()
    // {
    //     return canvasRef.current.scene;
    // }
    //   canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function(o, object) {
    //     object.set('selectable', false);
    // });
  }));

  return (
    <div className="editor" ref={viewRef}>
      <canvas
        id="canvas"
        className="canvas"
        width={props.width}
        height={props.height}
      >
        ):
      </canvas>
    </div>
  );
});

Editor.displayName = "Editor";

// Editor.propTypes = {
//    name: PropTypes.string,
// }

Editor.defaultProps = {
  name: "Editor",
  width: 800,
  height: 400,
};
