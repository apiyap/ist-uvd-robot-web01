import * as ROSLIB from "roslib";
import { GameObject } from "./index.js";
import { drawArrow } from "./Arrow";

// class OccupancyGrid {
//   constructor(options) {
//     options = options || {};
//     var message = options.message;

//     // save the metadata we need
//     this.pose = new ROSLIB.Pose({
//       position: message.info.origin.position,
//       orientation: message.info.origin.orientation,
//     });

// set the size
// this.width = message.info.width;
// this.height = message.info.height;
// canvas.width = this.width;
// canvas.height = this.height;

// var imageData = context.createImageData(this.width, this.height);
// for ( var row = 0; row < this.height; row++) {
//   for ( var col = 0; col < this.width; col++) {
//     // determine the index into the map data
//     var mapI = col + ((this.height - row - 1) * this.width);
//     // determine the value
//     var data = message.data[mapI];
//     var val;
//     if (data === 100) {
//       val = 0;
//     } else if (data === 0) {
//       val = 255;
//     } else {
//       val = 127;
//     }

//     // determine the index into the image data array
//     var i = (col + (row * this.width)) * 4;
//     // r
//     imageData.data[i] = val;
//     // g
//     imageData.data[++i] = val;
//     // b
//     imageData.data[++i] = val;
//     // a
//     imageData.data[++i] = 255;
//   }
// }
// context.putImageData(imageData, 0, 0);

// // create the bitmap
// createjs.Bitmap.call(this, canvas);
// // change Y direction
// this.y = -this.height * message.info.resolution;

// // scale the image
// this.scaleX = message.info.resolution;
// this.scaleY = message.info.resolution;
// this.width *= this.scaleX;
// this.height *= this.scaleY;

// // set the pose
// this.x += this.pose.position.x;
// this.y -= this.pose.position.y;
//   }
// }

export class OccupancyGridClient extends GameObject {
  constructor(engine, x, y, options) {
    super(engine, x, y, 0, 0);

    options = options || {};
    console.log("OccupancyGridClient:");
    console.log(options);

    var ros = options.ros;
    var topic = options.topic || "/map";
    this.continuous = options.continuous;
    this.zoom = 1.5;

    this.robot_width = options.width;
    this.robot_height = options.height;
    this.imgData = null;
    this.message = null;
    this.isRecieved = false;
    this.robotTf = null;

    // subscribe to the topic
    this.rosTopic = new ROSLIB.Topic({
      ros: ros,
      name: topic,
      messageType: "nav_msgs/OccupancyGrid",
      compression: "png",
    });
    // Setup a client to listen to TFs.
    this.tfClient = new ROSLIB.TFClient({
      ros: ros,
      angularThres: 0.01,
      transThres: 0.01,
      rate: 10.0,
      fixedFrame: topic,
    });

    this.tfClient.subscribe("/base_link", (e) => this.getRobotPosition(e));
    this.rosTopic.subscribe((e) => this.messageCallback(e));
  }

  getRobotPosition(msg) {
    //console.log("getRobotPosition:");
    this.robotTf = new ROSLIB.Transform(msg);

    //console.log(this.robotTf);
  }

  messageCallback(message) {
    this.message = message; //save message
    this.isRecieved = true;
    // console.log("recived:" + this.continuous);
    //console.log(this.message);
    // check if we should unsubscribe
    if (!this.continuous) {
      if (this.rosTopic) this.rosTopic.unsubscribe();
    }
  }

  draw(tr) {
    if (this.imgData !== null) {
      createImageBitmap(this.imgData, 0, 0, this.width, this.height).then(
        (imageBitmap) => {
          //

          this.engine.context.save();

          // clean up: reset transformations and stylings
          this.engine.context.setTransform(1, 0, 0, 1, 0, 0);

          this.engine.context.scale(this.zoom, this.zoom);

          // this.engine.context.translate(0,this.height)
          // var degrees = -90.0;
          //this.engine.context.rotate((degrees * Math.PI) / 180);

          // this.engine.context.translate(this.width,0)
          // var degrees = 90.0;
          // this.engine.context.rotate((degrees * Math.PI) / 180);

          //Flip Y
          // this.engine.context.translate(0,this.width);
          // this.engine.context.scale(1, -1);
          //

          this.engine.context.drawImage(imageBitmap, 0, 0);

          //Map Coordinate
          //  var pos = this.getPixel({
          //   x: 0,
          //   y: 0,
          // });
          // this.circle(pos,2, 'blue','red');

          if (this.robotTf != null) {
            var pos = this.getPixel({
              x: this.robotTf.translation.x,
              y: this.robotTf.translation.y,
            });

            this.engine.context.save();
            this.engine.context.fillStyle = "#ff8080";
            var rot = this.rosQuaternionToGlobalTheta(this.robotTf.rotation);
            var rw = this.robot_width / this.scaleX;
            var rh = this.robot_height / this.scaleY;
            this.engine.context.translate(pos.x, pos.y);
            this.engine.context.rotate(rot);

            this.engine.context.fillRect(0 - rw / 2, 0 - rh / 2, rw, rh);
            drawArrow(this.engine.context, 0, 0, 14, 0, 1, 1, 20, 4, "#f36", 2);
            this.engine.context.restore();

            this.circle(pos);
          }
          this.engine.context.restore();
        }
      );
    }
  }

  circle(pos, radius = 4, fill = "green", stroke = "#000000") {
    this.engine.context.save();
    this.engine.context.translate(pos.x, pos.y);
    this.engine.context.beginPath();
    this.engine.context.arc(0, 0, radius, 0, 2 * Math.PI, false);
    this.engine.context.fillStyle = fill;
    this.engine.context.fill();
    this.engine.context.lineWidth = 1;
    this.engine.context.strokeStyle = stroke;
    this.engine.context.stroke();
    this.engine.context.restore();
  }

  update(secondsPassed) {
    if (this.message != null && this.isRecieved) {
      this.isRecieved = false;
      // save the metadata we need
      this.pose = new ROSLIB.Pose({
        position: this.message.info.origin.position,
        orientation: this.message.info.origin.orientation,
      });

      // set the size
      this.width = this.message.info.width;
      this.height = this.message.info.height;

      this.imgData = this.engine.context.createImageData(
        this.width,
        this.height
      );

      for (var row = 0; row < this.height; row++) {
        for (var col = 0; col < this.width; col++) {
          // determine the index into the map data
          var mapI = col + (this.height - row - 1) * this.width;
          // determine the value
          var data = this.message.data[mapI];
          var val;
          if (data === 100) {
            val = 0;
          } else if (data === 0) {
            val = 255;
          } else {
            val = 127;
          }

          // determine the index into the image data array
          var i = (col + row * this.width) * 4;
          // r
          this.imgData.data[i] = val;
          // g
          this.imgData.data[++i] = val;
          // b
          this.imgData.data[++i] = val;
          // a
          this.imgData.data[++i] = 255;
        }
      }

      // change Y direction
      //this.y = -this.height * this.message.info.resolution;

      // scale the image
      this.scaleX = this.message.info.resolution;
      this.scaleY = this.message.info.resolution;
      // this.width *= this.scaleX;
      // this.height *= this.scaleY;
    }
  }
  rosQuaternionToGlobalTheta(orientation) {
    // See https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Rotation_matrices
    // here we use [x y z] = R * [1 0 0]
    var q0 = orientation.w;
    var q1 = orientation.x;
    var q2 = orientation.y;
    var q3 = orientation.z;

    return -Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3)); //  * 180.0 / Math.PI;// Canvas rotation is clock wise and in degrees
  }
  //
  getPixel(pos) {
    var x = 0;
    var y = 0;
    if (this.message) {
      x =
        (pos.x - this.message.info.origin.position.x) /
        this.message.info.resolution;
      y =
        this.height -
        (pos.y - this.message.info.origin.position.y) /
          this.message.info.resolution;
    }

    return {
      x: x,
      y: y,
    };
  }

  exit() {
    if (this.rosTopic) this.rosTopic.unsubscribe();
    if (this.tfClient) this.tfClient.unsubscribe("/base_link");
  }
}
