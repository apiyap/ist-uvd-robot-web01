import {scale, rotate, translate, compose, applyToPoint} from 'transformation-matrix';

export class CanvasObject {
    constructor(engine, x, y, w, h) {
      this.engine = engine;
      this.pos = { x: x, y: y };
      this.rot = 0;
      this.scale = 1;
      this.name = "CanvasObject";
      this.width = w;
      this.height = h;
    }
  
    getTransform(){
      return compose(
        translate(this.pos.x,this.pos.y),
        rotate(this.rot),
        scale(this.scale, this.scale)
      );
    }
  
    getRectangle() {
      return {
        x: this.pos.x,
        y: this.pos.y,
        width: this.width,
        height: this.height,
      };
    }
  
    draw(tr) {}
    update(t) {}
    exit() {}
  }
  
  