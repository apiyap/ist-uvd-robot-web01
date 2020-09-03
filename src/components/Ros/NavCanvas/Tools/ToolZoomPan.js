import { ToolObject } from "../ToolObject";


export class ToolZoomPan extends ToolObject {
  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.ros || "ZOOMPAN";
    this.icon = ["fas", "search-location"];

    this.dragInfo = {
      isDragging: false,
      startX: 0,
      startY: 0,
      diffX: 0,
      diffY: 0,
      canvasX: 0,
      canvasY: 0,
    };

    this.touchesInfo = {
      touches: [],
      startDis: 0,
      moveDis: 0,
      startScale: 1,
      isScale: false,
      isPan: false,
      startAngle: 0,
      startRot: 0,
      isRotate: false,
      rot: 0,
    };
  }

  onMouseDown(e) {
    this._dragStart({ x: e.clientX, y: e.clientY });
  }

  onMouseMove(e) {
    this._dragMove({ x: e.clientX, y: e.clientY });
  }

  onMouseUp(e) {
    this._dragEnd({ x: e.clientX, y: e.clientY });
  }

  onMouseWheel(evt) {
    var delta = evt.wheelDelta
      ? evt.wheelDelta / 40
      : evt.detail
      ? -evt.detail
      : 0;
    if (delta) {
      if (delta > 0) {
        this.engine.scaleUp();
      } else {
        this.engine.scaleDown();
      }
      // console.log("scale:" + this.engine.scale);
      if (this.engine.autoRobotCenter) this.engine.viewToRobot();
    }
  }

  onTouchStart(e) {
    this.touchesInfo.isScale = false;
    this.touchesInfo.isPan = false;

    if (e.touches.length > 1) {
      //Iterate over all touches
      for (var i = 0; i < e.touches.length; i++) {
        var id = e.touches[i].identifier;
        this.touchesInfo.touches[id] = {
          start: {
            x: e.touches[i].clientX,
            y: e.touches[i].clientY,
          },
          move: {
            x: 0,
            y: 0,
          },
        };
      }

      var x =
        this.touchesInfo.touches[1].start.x -
        this.touchesInfo.touches[0].start.x;
      var y =
        this.touchesInfo.touches[1].start.y -
        this.touchesInfo.touches[0].start.y;
      this.touchesInfo.startDis = Math.sqrt(x * x + y * y);
      this.touchesInfo.startAngle = Math.atan2(x, y);
      //console.log(this.touchesInfo);isScale
      // this.touchesInfo.startScale = null;
      this.touchesInfo.isScale = true; // fix for scale only
      this.touchesInfo.isRotate = false;

      this.touchesInfo.startScale = this.engine.scale;
      this.touchesInfo.startRot = this.engine.rot;
    } else {
      this.touchesInfo.isPan = true;
      const touch = e.touches[0];
      this._dragStart({ x: touch.clientX, y: touch.clientY });
    }
  }

  onTouchMove(e) {
    if (e.touches.length > 1) {
        //Iterate over all touches
        for (var i = 0; i < e.touches.length; i++) {
          var id = e.touches[i].identifier;
          if (this.touchesInfo.touches[id]) {
            this.touchesInfo.touches[id].move = {
              x: e.touches[i].clientX,
              y: e.touches[i].clientY,
            };
          }
        }
  
        var x =
          this.touchesInfo.touches[1].move.x - this.touchesInfo.touches[0].move.x;
        var y =
          this.touchesInfo.touches[1].move.y - this.touchesInfo.touches[0].move.y;
        this.touchesInfo.moveDis = Math.sqrt(x * x + y * y);
        var ang = Math.atan2(y, x);
        var diffAng = ang - this.touchesInfo.startAngle;
        var diffDis = this.touchesInfo.moveDis - this.touchesInfo.startDis;
  
        // if (
        //   this.touchesInfo.isRotate === false &&
        //   this.touchesInfo.isScale === false
        // ) {
        //   console.log("diff Ang:" + diffAng);
        //   console.log("diff Move:" + diffDis);
        //   if (diffAng > 2) this.touchesInfo.isRotate = true;
        //   else this.touchesInfo.isScale = true;
        // }
  
        if (this.touchesInfo.isScale) {
          if (this.touchesInfo.startScale) {
            var number = this.touchesInfo.moveDis / this.touchesInfo.startDis;
            this.touchesInfo.scale = this.touchesInfo.startScale * number;
            this.engine.setScale(this.touchesInfo.scale);
             
          }
        } else if (this.touchesInfo.isRotate) {
          this.touchesInfo.rot = this.touchesInfo.startRot + diffAng;
          this.engine.rot = this.touchesInfo.rot;
        }
      } else {
        if (this.touchesInfo.isPan) {
          const touch = e.touches[0];
          this._dragMove({ x: touch.clientX, y: touch.clientY });
        }
      }
  }

  onTouchEnd(e) {
    if (this.touchesInfo.isPan) {
        this.touchesInfo.isPan = false;
        const touch = e.changedTouches[0];
        this._dragEnd({ x: touch.clientX, y: touch.clientY });
      }
  
      this.touchesInfo.isRotate = false;
      this.touchesInfo.isScale = false;
      this.touchesInfo.startScale = null;
  }

  _dragStart(p) {
    this.dragInfo.isDragging = true;
    this.dragInfo.startX = p.x; //event.clientX;
    this.dragInfo.startY = p.y; //event.clientY;
    this.dragInfo.diffX = 0;
    this.dragInfo.diffY = 0;
    this.dragInfo.canvasX = this.engine.pos.x;
    this.dragInfo.canvasY = this.engine.pos.y;
  }
  _dragMove(p) {
    if (this.dragInfo.isDragging) {
      //this.viewToRobot();
      var dx = p.x /* event.clientX */ - this.dragInfo.startX;
      var dy = p.y /* event.clientY */ - this.dragInfo.startY;
      //console.log("dx:" + dx + ",dy:" + dy);
      this.dragInfo.diffX = this.dragInfo.canvasX + dx;
      this.dragInfo.diffY = this.dragInfo.canvasY + dy;

      this.engine.pos.x = this.dragInfo.diffX;
      this.engine.pos.y = this.dragInfo.diffY;
    }
  }
  _dragEnd(p) {
    this.dragInfo.isDragging = false;
    this.engine.pos.x = this.dragInfo.diffX;
    this.engine.pos.y = this.dragInfo.diffY;
  }
}
