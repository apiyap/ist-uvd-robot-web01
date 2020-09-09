import { ToolObject } from "../ToolObject";
import { drawCross, toRadians,toDegrees } from "../Utiles";
import { drawArrow } from '../Arrow';

import {
  scale,
  inverse,
  rotate,
  translate,
  compose,
  applyToPoint,
} from "transformation-matrix";

import { library, icon } from "@fortawesome/fontawesome-svg-core";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

library.add(faMapMarkerAlt);

const RouteCursor = icon({ prefix: "fas", iconName: "map-marker-alt" });

//IconPathData

export class ToolRoute extends ToolObject {
  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.ros || "ROUTE";
    this.icon = ["fas", "route"];
    this.cursor = this._createCursor();

    this.dragInfo = {
      isDragging: false,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      diffX: 0,
      diffY: 0,
      canvasX: 0,
      canvasY: 0,
    };

    this.goalInfo = {
      pos: {
        x: 0,
        y: 0,
      },
      end: {
        x : 0,
        y : 0
      },
      ang: 0,
      distance: 0,
    };
  }

  _createCursor() {
    var canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 24;
    var ctx = canvas.getContext("2d");
    // ctx.fillStyle = "#000000";
    // ctx.font = "24px FontAwesome";
    // ctx.textAlign = "center";
    // ctx.textBaseline = "middle";
    // ctx.fillText("\uf002", 12, 12);

    // var path = new Path2D(
    //   "M27 14h5c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2v0zM27 14c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2v0 14c0 1.112-0.895 2-2 2-1.112 0-2-0.896-2-2.001v-1.494c0-0.291 0.224-0.505 0.5-0.505 0.268 0 0.5 0.226 0.5 0.505v1.505c0 0.547 0.444 0.991 1 0.991 0.552 0 1-0.451 1-0.991v-14.009c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2c0-5.415 6.671-9.825 15-9.995v-1.506c0-0.283 0.224-0.499 0.5-0.499 0.268 0 0.5 0.224 0.5 0.499v1.506c8.329 0.17 15 4.58 15 9.995h-5z"
    // );
    // ctx.stroke(path);

    ctx.scale(
      canvas.width / RouteCursor.icon[0],
      canvas.height / RouteCursor.icon[1]
    );
    ctx.fillStyle = "blue";
    ctx.lineWidth = 40;
    ctx.strokeStyle = "white";
    var path = new Path2D(RouteCursor.icon[4]);
    //ctx.stroke(path);
    ctx.fill(path);

    var dataURL = canvas.toDataURL("image/png");
    return "url(" + dataURL + ") 8 24, pointer";
  }

  getCursor() {
    //   var cursors = [
    //     "url('data:image/png;base64,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') 0 0, pointer",
    // "url('data:image/png;base64,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') 0 0, pointer ",
    // "url('data:image/png;base64,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') 0 0, pointer "
    // ];
    // return cursors[0];
    //console.log(RouteCursor);
    return this.cursor;
  }

  onMouseDown(e) {
    this._dragStart({ x: e.offsetX, y: e.offsetY });
  }

  onMouseMove(e) {
    this._dragMove({ x: e.offsetX, y: e.offsetY });
  }

  onMouseUp(e) {
    this._dragEnd({ x: e.offsetX, y: e.offsetY });
  }

  onTouchStart(e) {
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();

    // console.log(touch);
    this._dragStart({ x: touch.clientX - rect.x, y: touch.clientY - rect.y });
  }

  onTouchMove(e) {
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();

    //console.log(touch);
    this._dragMove({ x: touch.clientX - rect.x, y: touch.clientY - rect.y });
  }

  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const rect = e.target.getBoundingClientRect();

    //console.log(touch);
    this._dragEnd({ x: touch.clientX - rect.x, y: touch.clientY - rect.y });
  }

  draw(tr) {
    

    if (this.dragInfo.isDragging) {
      
      var tr = inverse(this.engine.getTransform()); // draw in world coordinate
      var p = applyToPoint(tr, {
        x: this.dragInfo.startX,
        y: this.dragInfo.startY,
      });
      drawCross(this.engine.context, p, 4, "blue", 1);

      var p0 = applyToPoint(tr, {
        x: this.dragInfo.startX,
        y: this.dragInfo.startY,
      });
      var p1 = applyToPoint(tr, {
        x: this.dragInfo.endX,
        y: this.dragInfo.endY,
      });

      // //drawArrow(this.engine.context, p0.x, p0.y, p1.x, p1.y, 1, 1, toRadians(30), 4, "blue", 1);

      this.engine.context.beginPath();
      this.engine.context.strokeStyle = "blue";
      //this.engine.context.fillStyle = color;
      this.engine.context.lineWidth = 1;
      this.engine.context.moveTo(p0.x, p0.y);
      this.engine.context.lineTo(p1.x, p1.y);
      this.engine.context.stroke();


      // this.engine.context.save();
      // this.engine.context.translate(p1.x, p1.y);
      // this.engine.context.rotate(this.goalInfo.ang - toRadians(90));
      // const l = 10;
      // const ang =15;
      // const ang1 = toRadians(ang);
      // const ang2 = toRadians(-ang);
      // var h1 = { x: l*Math.cos(ang1), y: l*Math.sin(ang1)};
      // var h2 = { x: l*Math.cos(ang2), y: l*Math.sin(ang2)};
      // this.engine.context.beginPath();
      // this.engine.context.strokeStyle = "blue";
      // //this.engine.context.fillStyle = color;
      // this.engine.context.lineWidth = 1;
      // this.engine.context.moveTo(0, 0);
      // this.engine.context.lineTo(h1.x, h1.y);
      // this.engine.context.moveTo(0, 0);
      // this.engine.context.lineTo(h2.x, h2.y);
      // this.engine.context.stroke();
      // this.engine.context.restore();

  
    }

    ;
  }

  _dragStart(p) {
    this.dragInfo.startX = p.x;
    this.dragInfo.startY = p.y;
    this.dragInfo.endX = p.x;
    this.dragInfo.endY = p.y;

    this.dragInfo.diffX = 0;
    this.dragInfo.diffY = 0;

    this.goalInfo = this.engine.getGoal();
    this.goalInfo.pos.x = this.dragInfo.startX;
    this.goalInfo.pos.y = this.dragInfo.startY;
    this.goalInfo.end.x = this.dragInfo.startX;
    this.goalInfo.end.y = this.dragInfo.startY;

    this.dragInfo.canvasX = this.goalInfo.pos.x;
    this.dragInfo.canvasY = this.goalInfo.pos.y;
    this.dragInfo.isDragging = true;
  }
  _dragMove(p) {
    if (this.dragInfo.isDragging) {
      this.dragInfo.endX = p.x;
      this.dragInfo.endY = p.y;
      this.goalInfo.end.x = p.x;
      this.goalInfo.end.y = p.y;

      //this.viewToRobot();
      var dx = p.x  - this.dragInfo.startX;
      var dy = p.y  - this.dragInfo.startY;

      this.goalInfo.distance = Math.sqrt(dx * dx + dy * dy);

      this.goalInfo.ang = Math.atan2(dy, dx);

      
      this.dragInfo.diffX = this.dragInfo.canvasX + dx;
      this.dragInfo.diffY = this.dragInfo.canvasY + dy;

      this.goalInfo.pos.x = this.dragInfo.startX;
      this.goalInfo.pos.y = this.dragInfo.startY;


      this.engine.setGoal(this.goalInfo);
    }
  }

  _dragEnd(p) {
    if (this.dragInfo.isDragging) {
      this.dragInfo.isDragging = false;
      this.engine.setGoal(this.goalInfo);
      //console.log(toDegrees(this.goalInfo.ang))
      //console.log(this.engine.getGoal())
      if(typeof(this.engine.sendGoalROS) === "function") 
        this.engine.sendGoalROS();
    }
  }

}
