import {
  scale,
  inverse,
  rotate,
  translate,
  compose,
  applyToPoint,
} from "transformation-matrix";
import {
  rosQuaternionToGlobalTheta,
  low_pass_filter,
} from "./Utiles";

import { ToolObject } from "./ToolObject";
import { ToolZoomPan } from "./Tools/ToolZoomPan";
import { ToolRoute } from  "./Tools/ToolRoute";


export class NavCanvas {
  static min_scale = 0.25;
  static max_scale = 6.0;

  constructor(canvas) {
    // Get a reference to the canvas
    this.canvas = document.getElementById(canvas);

    this.context = this.canvas.getContext("2d");
    this.secondsPassed = 0.0;
    this.oldTimeStamp = 0.0;
    this.canvasObjects = [];
    this.activeTool = "NONE";

    this.toolObjects = {
      'NONE': new ToolObject(this),
      'ZOOMPAN': new ToolZoomPan(this),
      'ROUTE' : new ToolRoute(this),
    };

    this.autoRobotCenter = true;
    this.autoRotation = true;
    this.lowpassX = new low_pass_filter({
      Beta: 0.95,
      StartData: 0,
    });
    this.lowpassY = new low_pass_filter({
      Beta: 0.95,
      StartData: 0,
    });

    this.lowpassRot = new low_pass_filter({
      Beta: 0.95,
      StartData: 0,
    });

    this.pos = { x: 0, y: 0 };
    this.rot = 0;
    this.scale = 1;
    this.scaleStep = 0.25;

    // this.dragInfo = {
    //   isDragging: false,
    //   startX: 0,
    //   startY: 0,
    //   diffX: 0,
    //   diffY: 0,
    //   canvasX: 0,
    //   canvasY: 0,
    // };

    // this.touchesInfo = {
    //   touches: [],
    //   startDis: 0,
    //   moveDis: 0,
    //   startScale: 1,
    //   isScale: false,
    //   isPan: false,
    //   startAngle: 0,
    //   startRot: 0,
    //   isRotate: false,
    //   rot: 0,
    // };

    this.gridObj = null;

    // mouse event
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
    this.canvas.addEventListener(
      "DOMMouseScroll",
      (e) => this.handleScroll(e),
      false
    );
    this.canvas.addEventListener(
      "mousewheel",
      (e) => this.handleScroll(e),
      false
    );

    this.canvas.addEventListener(
      "touchstart",
      (e) => this.touchStartHandler(e),
      false
    );
    this.canvas.addEventListener(
      "touchmove",
      (e) => this.touchMoveHandler(e),
      false
    );
    this.canvas.addEventListener(
      "touchend",
      (e) => this.touchEndHandler(e),
      false
    );
  }

  init() {
    // Loop over all game objects
    for (let i = 0; i < this.canvasObjects.length; i++) {
      if (this.canvasObjects[i].name === "OccupancyGridClient") {
        this.gridObj = this.canvasObjects[i];
        this.gridObj.onRobotPosition = (e) => {
          //console.log(e);

          if (this.autoRotation) {
            var rot = rosQuaternionToGlobalTheta(e.rotation);
            var cal = -(Math.PI / 2) - rot;
            this.rot = cal; //this.lowpassRot.filter(cal);
          }

          if (this.autoRobotCenter) this.viewToRobot();
        };
      }
    }
    this.gameLoop(0);
  }

  setActiveTool(v) {
    if (this.toolObjects[v]) this.activeTool = v;
  }

  scaleUp() {
    if (this.scale < NavCanvas.max_scale) this.scale += this.scaleStep;
  }

  scaleDown() {
    if (this.scale > NavCanvas.min_scale) this.scale -= this.scaleStep;
  }
  setScale(v) {
    this.scale = v;
    if (this.scale > NavCanvas.max_scale) this.scale = NavCanvas.max_scale;
    if (this.scale < NavCanvas.min_scale) this.scale = NavCanvas.min_scale;
    if (this.autoRobotCenter) this.viewToRobot();
  }

  getTransform() {
    return compose(
      translate(this.pos.x, this.pos.y),
      rotate(this.rot),
      scale(this.scale, this.scale)
    );
  }
  getMinMax() {
    var min_x = Number.MAX_SAFE_INTEGER;
    var min_y = Number.MAX_SAFE_INTEGER;
    var max_x = Number.MIN_SAFE_INTEGER;
    var max_y = Number.MIN_SAFE_INTEGER;

    for (let i = 0; i < this.canvasObjects.length; i++) {
      var rect = this.canvasObjects[i].getRectangle();
      min_x = Math.min(min_x, rect.x);
      min_y = Math.min(min_y, rect.y);
      max_x = Math.max(max_x, rect.x + rect.width);
      max_y = Math.max(max_y, rect.y + rect.height);
      //console.log(rect);
    }
    console.log(
      "min X:" + min_x + ",Y:" + min_y + ", max X:" + max_x + ", Y:" + max_y
    );

    return {
      min: {
        x: min_x,
        y: min_y,
      },
      max: {
        x: max_x,
        y: max_y,
      },
    };
  }

  rotateViewLeft() {
    var step = Math.PI / 2;
    this.rot -= step;

    this.rot = Math.round(this.rot / step) * step;

    this.enViewToRobot = true;
    this.viewToRobot();
    this.viewToRobot();
  }

  rotateViewRight() {
    var step = Math.PI / 2;

    this.rot += step;
    //vec.x = Mathf.Round(vec.x / 90) * 90;
    //(Math.ceil(number*20)/20)
    this.rot = Math.round(this.rot / step) * step;

    this.enViewToRobot = true;
    this.viewToRobot();
    this.viewToRobot();
  }

  viewToRobot() {
    //From Screen coordinate
    var ct = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    //to world coordinate
    var ctW = applyToPoint(inverse(this.getTransform()), ct);
    if (this.gridObj !== null) {
      var rW = applyToPoint(
        compose(this.gridObj.getTransform()),
        this.gridObj.getRobotPixel()
      );
      var diff = { x: ctW.x - rW.x, y: ctW.y - rW.y };
      var dW = applyToPoint(this.getTransform(), diff); // apply diff to world coordinate
      // console.log("Rot:" + radians_to_degrees(this.rot));
      // console.log("Diff:");
      // console.log(dW);
      this.pos.x = this.lowpassX.filter(dW.x);
      this.pos.y = this.lowpassY.filter(dW.y);

      // this.pos.x = dW.x;
      // this.pos.y = dW.y;
    }
  }

  touchStartHandler(e) {
    e.preventDefault();
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onTouchStart(e);
    }

    // this.touchesInfo.isScale = false;
    // this.touchesInfo.isPan = false;

    // if (e.touches.length > 1) {
    //   //Iterate over all touches
    //   for (var i = 0; i < e.touches.length; i++) {
    //     var id = e.touches[i].identifier;
    //     this.touchesInfo.touches[id] = {
    //       start: {
    //         x: e.touches[i].clientX,
    //         y: e.touches[i].clientY,
    //       },
    //       move: {
    //         x: 0,
    //         y: 0,
    //       },
    //     };
    //   }

    //   var x =
    //     this.touchesInfo.touches[1].start.x -
    //     this.touchesInfo.touches[0].start.x;
    //   var y =
    //     this.touchesInfo.touches[1].start.y -
    //     this.touchesInfo.touches[0].start.y;
    //   this.touchesInfo.startDis = Math.sqrt(x * x + y * y);
    //   this.touchesInfo.startAngle = Math.atan2(x, y);
    //   //console.log(this.touchesInfo);isScale
    //   // this.touchesInfo.startScale = null;
    //   this.touchesInfo.isScale = true; // fix for scale only
    //   this.touchesInfo.isRotate = false;

    //   this.touchesInfo.startScale = this.scale;
    //   this.touchesInfo.startRot = this.rot;
    // } else {
    //   this.touchesInfo.isPan = true;
    //   const touch = e.touches[0];
    //   this._dragStart({ x: touch.clientX, y: touch.clientY });
    // }
  }
  touchMoveHandler(e) {
    e.preventDefault();
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onTouchMove(e);
    }

    // if (e.touches.length > 1) {
    //   //Iterate over all touches
    //   for (var i = 0; i < e.touches.length; i++) {
    //     var id = e.touches[i].identifier;
    //     if (this.touchesInfo.touches[id]) {
    //       this.touchesInfo.touches[id].move = {
    //         x: e.touches[i].clientX,
    //         y: e.touches[i].clientY,
    //       };
    //     }
    //   }

    //   var x =
    //     this.touchesInfo.touches[1].move.x - this.touchesInfo.touches[0].move.x;
    //   var y =
    //     this.touchesInfo.touches[1].move.y - this.touchesInfo.touches[0].move.y;
    //   this.touchesInfo.moveDis = Math.sqrt(x * x + y * y);
    //   var ang = Math.atan2(y, x);
    //   var diffAng = ang - this.touchesInfo.startAngle;
    //   var diffDis = this.touchesInfo.moveDis - this.touchesInfo.startDis;

    //   // if (
    //   //   this.touchesInfo.isRotate === false &&
    //   //   this.touchesInfo.isScale === false
    //   // ) {
    //   //   console.log("diff Ang:" + diffAng);
    //   //   console.log("diff Move:" + diffDis);
    //   //   if (diffAng > 2) this.touchesInfo.isRotate = true;
    //   //   else this.touchesInfo.isScale = true;
    //   // }

    //   if (this.touchesInfo.isScale) {
    //     if (this.touchesInfo.startScale) {
    //       var number = this.touchesInfo.moveDis / this.touchesInfo.startDis;
    //       this.touchesInfo.scale = this.touchesInfo.startScale * number;

    //       if (this.touchesInfo.scale > NavCanvas.max_scale)
    //         this.touchesInfo.scale = NavCanvas.max_scale;
    //       if (this.touchesInfo.scale < NavCanvas.min_scale)
    //         this.touchesInfo.scale = NavCanvas.min_scale;
    //       this.scale = this.touchesInfo.scale;
    //       if (this.autoRobotCenter) this.viewToRobot();
    //     }
    //   } else if (this.touchesInfo.isRotate) {
    //     this.touchesInfo.rot = this.touchesInfo.startRot + diffAng;
    //     this.rot = this.touchesInfo.rot;
    //   }
    // } else {
    //   if (this.touchesInfo.isPan) {
    //     const touch = e.touches[0];
    //     this._dragMove({ x: touch.clientX, y: touch.clientY });
    //   }
    // }
  }
  touchEndHandler(e) {
    e.preventDefault();
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onTouchEnd(e);
    }
    //console.log(this.touchesInfo);

    // if (this.touchesInfo.isPan) {
    //   this.touchesInfo.isPan = false;
    //   const touch = e.changedTouches[0];
    //   this._dragEnd({ x: touch.clientX, y: touch.clientY });
    // }

    // this.touchesInfo.isRotate = false;
    // this.touchesInfo.isScale = false;
    // this.touchesInfo.startScale = null;
  }

  handleScroll(evt) {
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onMouseWheel(evt);
    }

    // var delta = evt.wheelDelta
    //   ? evt.wheelDelta / 40
    //   : evt.detail
    //   ? -evt.detail
    //   : 0;
    // if (delta) {
    //   if (delta > 0) {
    //     if (this.scale < NavCanvas.max_scale) this.scale += this.scaleStep;
    //   } else {
    //     if (this.scale > NavCanvas.min_scale) this.scale -= this.scaleStep;
    //   }
    //   //console.log("scale:" + this.scale);
    //   if (this.autoRobotCenter) this.viewToRobot();
    // }
    return evt.preventDefault() && false;
  }

  // _dragStart(p) {
  //   this.dragInfo.isDragging = true;
  //   this.dragInfo.startX = p.x; //event.clientX;
  //   this.dragInfo.startY = p.y; //event.clientY;
  //   this.dragInfo.diffX = 0;
  //   this.dragInfo.diffY = 0;
  //   this.dragInfo.canvasX = this.pos.x;
  //   this.dragInfo.canvasY = this.pos.y;
  // }
  // _dragMove(p) {
  //   if (this.dragInfo.isDragging) {
  //     //this.viewToRobot();
  //     var dx = p.x /* event.clientX */ - this.dragInfo.startX;
  //     var dy = p.y /* event.clientY */ - this.dragInfo.startY;
  //     //console.log("dx:" + dx + ",dy:" + dy);
  //     this.dragInfo.diffX = this.dragInfo.canvasX + dx;
  //     this.dragInfo.diffY = this.dragInfo.canvasY + dy;

  //     this.pos.x = this.dragInfo.diffX;
  //     this.pos.y = this.dragInfo.diffY;
  //   }
  // }
  // _dragEnd(p) {
  //   this.dragInfo.isDragging = false;
  //   this.pos.x = this.dragInfo.diffX;
  //   this.pos.y = this.dragInfo.diffY;
  // }

  /**
   *
   * @param {MouseEvent} event
   * @return {void}
   */
  onMouseDown(event) {
    //this._dragStart({ x: event.clientX, y: event.clientY });
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onMouseDown(event);
    }
  }
  /**
   *
   * @param {MouseEvent} event
   * @return {void}
   */
  onMouseMove(event) {
    //this._dragMove({ x: event.clientX, y: event.clientY });
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onMouseMove(event);
    }
  }

  onMouseUp(event) {
    //this._dragEnd({ x: event.clientX, y: event.clientY });
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onMouseUp(event);
    }
  }

  /**
   *
   * @return {Canvas}
   */
  getCanvas() {
    return this.canvas;
  }

  /**
   *
   * @return {Image}
   */
  getImage() {
    const img = new Image();
    const data = this.canvas.toDataURL("image/png");
    img.src = data;

    return img;
  }

  gameLoop(timeStamp) {
    // Update game objects in the loop
    // Calculate how much time has passed
    this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;
    // Move forward in time with a maximum amount
    this.secondsPassed = Math.min(this.secondsPassed, 0.1);

    // Pass the time to the update
    this.update(this.secondsPassed);
    this.draw();
    // console.log("time:" + timeStamp)

    window.requestAnimationFrame((timeStamp) => {
      this.gameLoop(timeStamp);
    });
  }

  update(secondsPassed) {
    // Loop over all game objects
    for (let i = 0; i < this.canvasObjects.length; i++) {
      this.canvasObjects[i].update(secondsPassed);
    }

    //detectCollisions();
  }

  draw() {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();

    //World coordinate
    this.context.save();

    this.context.translate(this.pos.x, this.pos.y);
    this.context.rotate(this.rot);
    this.context.scale(this.scale, this.scale);

    // Do the same to draw
    let tr = this.context.getTransform();
    //this.context.setTransform(tr) ;
    for (let i = 0; i < this.canvasObjects.length; i++) {
      this.canvasObjects[i].draw(tr);
    }

    // var ct = { x: this.canvas.width / 2, y: this.canvas.height / 2 };

    // //from world coordinate
    // var ctW = applyToPoint(inverse(this.getTransform()), ct);
    // drawCross(this.context, ctW, 20, "orange");
    // if (this.gridObj !== null) {
    //   var rW = applyToPoint(
    //     compose(this.gridObj.getTransform()),
    //     this.gridObj.getRobotPixel()
    //   );
    //   drawCross(this.context, rW, 20, "orange");
    // }

    //this.context.restore();
    this.context.restore();

    //for DEBUG coordinate
    //Screen coordinate

    // var p = applyToPoint(this.getTransform(), { x: 0, y: 0 });
    // drawCross(this.context, p, 20, "red");

    // //get Robot position from screen coordinate
    // if (this.gridObj !== null) {
    //   var r = applyToPoint(
    //     compose(this.getTransform(), this.gridObj.getTransform()),
    //     this.gridObj.getRobotPixel()
    //   );
    //   drawCross(this.context, r, 20, "blue");

    //   this.context.beginPath();
    //   this.context.moveTo(ct.x, ct.y);
    //   this.context.lineTo(r.x, r.y);
    //   this.context.moveTo(ct.x, ct.y);
    //   this.context.lineTo(p.x, p.y);
    //   //ctx.strokeStyle = color;
    //   this.context.stroke();
    // }

    // drawCross(this.context, ct, 20);
  }

  exit() {
    for (let i = 0; i < this.canvasObjects.length; i++) {
      this.canvasObjects[i].exit();
    }
  }
}
