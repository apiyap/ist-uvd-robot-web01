/*
Ref : https://spicyyoghurt.com/tutorials/html5-javascript-game-development/develop-a-html5-javascript-game

*/

//import {trackTransforms } from './Zoom'

export class GameObject {
  // engine : H5Canvas;
  // x : number = 0;
  // y : number = 0;
  // vx : number = 0;
  // vy : number = 0;
  // isColliding : boolean;

  constructor(engine, x, y, vx, vy) {
    this.engine = engine;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    this.isColliding = false;
  }
  getX() {
    return this.x;
  }

  draw(tr) {}
  update(t) {}

  exit() {}
}

export class SquareBitmap extends GameObject {
  constructor(engine, x, y, vx, vy, w, h) {
    super(engine, x, y, vx, vy);
    this.width = w;
    this.height = h;
    this.imgData = this.engine.context.createImageData(this.width, this.height);

    this.x_dir = 1;
    this.y_dir = 1;
  }

  draw(tr) {
    this.engine.context.putImageData(this.imgData, this.x, this.y);
  }

  update(secondsPassed) {
    // Move with set velocity
    if (this.x > this.engine.canvas.width) this.x_dir = -1;
    if (this.y > this.engine.canvas.height) this.y_dir = -1;

    if (this.x < 0) this.x_dir = 1;
    if (this.y < 0) this.y_dir = 1;

    this.x += this.vx * secondsPassed * this.x_dir;
    this.y += this.vy * secondsPassed * this.y_dir;

    var i;
    for (i = 0; i < this.imgData.data.length; i += 4) {
      this.imgData.data[i + 0] = 100;
      this.imgData.data[i + 1] = 0;
      this.imgData.data[i + 2] = 0;
      this.imgData.data[i + 3] = 255;
    }
  }
}

export class Square extends GameObject {
  // Set default width and height
  static width = 50;
  static height = 50;
  // x_dir : number;
  // y_dir : number;

  constructor(engine, x, y, vx, vy, dx, dy) {
    super(engine, x, y, vx, vy);
    this.x_dir = dx;
    this.y_dir = dy;
  }

  draw(tr) {
    // Draw a simple square
    this.engine.context.fillStyle = this.isColliding ? "#ff8080" : "#0099b0";
    this.engine.context.fillRect(this.x, this.y, Square.width, Square.height);
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

export class H5Canvas {
  constructor(canvas) {
    // Get a reference to the canvas
    this.canvas = document.getElementById(canvas);

    this.context = this.canvas.getContext("2d");
    this.secondsPassed = 0.0;
    this.oldTimeStamp = 0.0;
    this.gameObjects = [];
    this.zoom = 1.0;
    this.scaleStep =   0.25;

    this.scale = 1;
    this.dragInfo = {
      isDragging: false,
      startX: 0,
      startY: 0,
      diffX: 0,
      diffY: 0,
      canvasX: 0,
      canvasY: 0,
    };

    // mouse event
    this.canvas.addEventListener("mousedown", (e) => this.dragStart(e));
    this.canvas.addEventListener("mousemove", (e) => this.drag(e));
    this.canvas.addEventListener("mouseup", (e) => this.dragEnd(e));
    this.canvas.addEventListener("DOMMouseScroll", (e)=>this.handleScroll(e), false);
    this.canvas.addEventListener("mousewheel", (e)=>this.handleScroll(e), false);
  }

  init() {
    this.gameLoop(0);
  }

  handleScroll(evt) {
    var delta = evt.wheelDelta
      ? evt.wheelDelta / 40
      : evt.detail
      ? -evt.detail
      : 0;
    if (delta) 
    {
      
      if(delta>0){
        this.scale += this.scaleStep;
      }else{
        this.scale -= this.scaleStep;
      }
      //console.log("zoom:" + this.scale);
    }
    return evt.preventDefault() && false;
  }

 
  /**
   *
   * @param {MouseEvent} event
   * @return {void}
   */
  dragStart(event) {
    this.dragInfo.isDragging = true;
    this.dragInfo.startX = event.clientX;
    this.dragInfo.startY = event.clientY;
    //console.log("dragStart")
  }
  /**
   * ドラッグで画像を移動する
   * @param {MouseEvent} event マウスイベント
   * @return {void}
   */
  drag(event) {
    if (this.dragInfo.isDragging) {
      // 開始位置 + 差分 / スケール （画像の大きさによる移動距離の補正のためスケールで割る）
      this.dragInfo.diffX =
        this.dragInfo.canvasX +
        (event.clientX - this.dragInfo.startX) / this.scale;
      this.dragInfo.diffY =
        this.dragInfo.canvasY +
        (event.clientY - this.dragInfo.startY) / this.scale;

      //this._redraw();
      //console.log(this.dragInfo)
    }
  }

  dragEnd(event) {
    this.dragInfo.isDragging = false;
    // mousedown時のカクつきをなくすため
    this.dragInfo.canvasX = this.dragInfo.diffX;
    this.dragInfo.canvasY = this.dragInfo.diffY;
    //console.log(this.dragInfo);
  }

  /**
   * canvasを出力する
   * @return {Canvas}
   */
  getCanvas() {
    return this.canvas;
  }

  /**
   * imgを出力する
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
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].update(secondsPassed);
    }
    //detectCollisions();
  }

  draw() {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();

    this.context.save();
    if (this.dragInfo.isDragging) {
      this.context.translate( this.dragInfo.diffX,  this.dragInfo.diffY)
      
    }else{
      this.context.translate(this.dragInfo.canvasX,this.dragInfo.canvasY)
    }

    this.context.scale(this.scale, this.scale);

    // this.context.scale(this.zoom, this.zoom);
    // Do the same to draw
    let tr = this.context.getTransform();
    //this.context.setTransform(tr) ;
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].draw(tr);
    }
    //this.context.restore();
    this.context.restore();
  }

  exit() {
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].exit();
    }
  }
}

//let gameObjects;

// function drawTest() {
//   if (canvasRef.current !== null) {
//     if (canvasRef.current.getContext) {
//       var ctx = canvasRef.current.getContext("2d");
//       ctx.clearRect(0, 0, viewWidth, viewHeight);

//       var imgData = ctx.createImageData(100, 100);
//       var i;
//       for (i = 0; i < imgData.data.length; i += 4) {
//         imgData.data[i + 0] = 255;
//         imgData.data[i + 1] = 0;
//         imgData.data[i + 2] = 0;
//         imgData.data[i + 3] = 255;
//       }

//       lastx += xstep * xdir;

//       if (lastx > viewWidth) {
//         xdir = -1;
//         lastx = viewWidth;
//       }
//       if (lastx < 0) {
//         lastx = 0;
//         xdir = 1;
//       }
//       ctx.putImageData(imgData, lastx, lasty);

//       //var myImageData = ctx.getImageData(left, top, width, height);
//     }
//   }
// }

//   function detectCollisions(){
//     let obj1;
//     let obj2;

//     // Reset collision state of all objects
//     for (let i = 0; i < gameObjects.length; i++) {
//         gameObjects[i].isColliding = false;
//     }

//     // Start checking for collisions
//     for (let i = 0; i < gameObjects.length; i++)
//     {
//         obj1 = gameObjects[i];
//         for (let j = i + 1; j < gameObjects.length; j++)
//         {
//             obj2 = gameObjects[j];

//             // Compare object1 with object2
//             if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
//                 obj1.isColliding = true;
//                 obj2.isColliding = true;
//             }
//         }
//     }
// }
// function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
//   // Check x and y for overlap
//   if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
//       return false;
//   }
//   return true;
// }

// function circleIntersect(x1, y1, r1, x2, y2, r2) {

//   // Calculate the distance between the two circles
//   let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

//   // When the distance is smaller or equal to the sum
//   // of the two radius, the circles touch or overlap
//   return squareDistance <= ((r1 + r2) * (r1 + r2))
// }
// Example easing functions
// function easeInOutQuint(t, b, c, d) {
//   if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
//   return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
// }

// function easeLinear(t, b, c, d) {
//   return (c * t) / d + b;
// }
