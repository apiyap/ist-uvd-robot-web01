import {CanvasObject} from "../CanvasObject";

export class Square extends CanvasObject {
    // Set default width and height
    static width = 50;
    static height = 50;
    // x_dir : number;
    // y_dir : number;
  
    constructor(engine, x, y, vx, vy, dx, dy) {
      super(engine, x, y, vx, vy);
      this.x_dir = dx;
      this.y_dir = dy;
      this.name = "Square";
    }
  
    draw(tr) {
      // Draw a simple square
      this.engine.context.save();
      this.engine.context.translate(this.pos.x, this.pos.y);
  
      this.engine.context.fillStyle = this.isColliding ? "#ff8080" : "#0099b0";
      this.engine.context.fillRect(0, 0, Square.width, Square.height);
  
      this.engine.context.restore();
    }
  
    update(secondsPassed) {
      // // Move with set velocity
      // if (this.x > this.engine.canvas.width) this.x_dir = -1;
      // if (this.y > this.engine.canvas.height) this.y_dir = -1;
      // if (this.x < 0) this.x_dir = 1;
      // if (this.y < 0) this.y_dir = 1;
      // this.x += this.vx * secondsPassed * this.x_dir;
      // this.y += this.vy * secondsPassed * this.y_dir;
      //console.log("x:" + this.x + ",Y:" + this.y + ">" + this.engine.canvas.height)
    }
  }
  