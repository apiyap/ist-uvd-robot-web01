import * as ROSLIB from "roslib";
import { drawArrow } from "../Arrow";
import { CanvasObject } from "../CanvasObject";
// import {
//   scale,
//   rotate,
//   translate,
//   compose,
//   applyToPoint,
// } from "transformation-matrix";

export class OccupancyGridClient extends CanvasObject {
  constructor(engine, x, y, options) {
    super(engine, x, y, 20, 20);

    options = options || {};
    console.log("OccupancyGridClient:");
    console.log(options);

    this.name = "OccupancyGridClient";

    var ros = options.ros;
    var topic = options.topic || "/map";
    this.continuous = options.continuous;

    this.robot_width = options.width;
    this.robot_height = options.height;
    this.imgData = null;
    this.message = null;
    this.isRecieved = false;
    this.robotTf = null;
    this.onRobotPosition = null;

    this.imageBitmap = null;

    var service = options.service || "/aragorn/map_saver";
    // Setting up to the service
    this.rosSaveMapService = new ROSLIB.Service({
      ros: ros,
      name: service,
      serviceType: "aragorn_msg/MapSaver",
    });

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
      angularThres: 0.001,
      transThres: 0.01,
      rate: 10.0,
      fixedFrame: topic,
    });

    this.tfClient.subscribe("/base_link", (e) => this.getRobotPosition(e));
    this.rosTopic.subscribe((e) => this.messageCallback(e));
  }

  async saveMap(name) {
    return await new Promise((resolve, reject) => {
      try {
        this.rosSaveMapService.callService(
          new ROSLIB.ServiceRequest({ map_name: name }),
          function (response) {
           // console.log(response);
            resolve(response);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  getRobotPosition(msg) {
    //console.log("getRobotPosition:");
    this.robotTf = new ROSLIB.Transform(msg);
    if (typeof this.onRobotPosition === "function") {
      this.onRobotPosition(this.robotTf);
    }
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

  getRobotPixel() {
    if (this.robotTf != null) {
      var p = this.getPixel({
        x: this.robotTf.translation.x,
        y: this.robotTf.translation.y,
      });
      return p;
    }

    return { x: NaN, y: NaN };
  }

  getMapOrigin() {
    return this.getPixel({
      x: 0,
      y: 0,
    });
  }

  drawMapGrid(color = "black", lineW = 1) {
    if (this.message) {
      var rosPosOrg = {
        x: this.message.info.origin.position.x,
        y: this.message.info.origin.position.y,
      };
      var rosMaxPos = {
        x: this.message.info.origin.position.x * -1,
        y: this.message.info.origin.position.y * -1,
      };
      var linesX = [];

      for (var x = rosPosOrg.x; x <= rosMaxPos.x; x++) {
        linesX.push({
          from: this.getPixel({ x: x, y: rosPosOrg.y }),
          to: this.getPixel({ x: x, y: rosMaxPos.y }),
        });
      }
      var linesY = [];
      for (var y = rosPosOrg.y; y <= rosMaxPos.y; y++) {
        linesY.push({
          from: this.getPixel({ x: rosPosOrg.x, y: y }),
          to: this.getPixel({ x: rosMaxPos.x, y: y }),
        });
      }

      this.engine.context.beginPath();

      for (let i = 0; i < linesX.length; i++) {
        this.engine.context.moveTo(linesX[i].from.x, linesX[i].from.y);
        this.engine.context.lineTo(linesX[i].to.x, linesX[i].to.y);
      }
      for (let i = 0; i < linesY.length; i++) {
        this.engine.context.moveTo(linesY[i].from.x, linesY[i].from.y);
        this.engine.context.lineTo(linesY[i].to.x, linesY[i].to.y);
      }

      this.engine.context.lineWidth = lineW;
      // set line color
      this.engine.context.strokeStyle = color;
      this.engine.context.stroke();
    }
  }

  drawCross(p, l = 4, color = "green", lineW = 1) {
    this.engine.context.save();
    this.engine.context.translate(p.x, p.y);
    this.engine.context.beginPath();
    this.engine.context.moveTo(0, 0);
    this.engine.context.lineTo(0 + l, 0);

    this.engine.context.moveTo(0, 0);
    this.engine.context.lineTo(0, 0 + l);

    this.engine.context.moveTo(0, 0);
    this.engine.context.lineTo(0 - l, 0);

    this.engine.context.moveTo(0, 0);
    this.engine.context.lineTo(0, 0 - l);

    this.engine.context.lineWidth = lineW;
    this.engine.context.strokeStyle = color;
    this.engine.context.stroke();

    this.engine.context.restore();
  }

  draw(tr) {
    if (this.imageBitmap !== null) {
      this.engine.context.save();
      this.engine.context.translate(this.pos.x, this.pos.y);
      this.engine.context.drawImage(this.imageBitmap, 0, 0);
      this.drawMapGrid("blue", 0.1);

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
        this.drawCross(pos);
        //this.circle(pos);
      }

      //this.circle({ x: 0, y: 0 }, 4, "red");
      //this.drawCross({x:0,y:0},6,'red')
      //this.circle(this.getMapOrigin(), 4, "red");
      this.drawCross(this.getMapOrigin(), 6, "red", 0.5);

      this.engine.context.restore();
    }
  }

  circle(pos, radius = 4, fill = "green", stroke = "#000000") {
    this.engine.context.save();
    this.engine.context.translate(pos.x, pos.y);
    this.engine.context.beginPath();
    this.engine.context.arc(
      -radius / 2,
      -radius / 2,
      radius,
      0,
      2 * Math.PI,
      false
    );
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
      createImageBitmap(this.imgData, 0, 0, this.width, this.height).then(
        (imageBitmap) => (this.imageBitmap = imageBitmap)
      );

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

//https://www.w3resource.com/html5-canvas/html5-canvas-matrix-transforms.php

// This is done with one of the following methods :

// transform(a, b, c, d, e, f)
// setTransform(a, b, c, d, e, f)
// Note : The arguments a, b, c, d, e, and f are sometimes called m11, m12, m21, m22, dx, and dy or m11, m21, m12, m22, dx, and dy.
// ctx.transform(m11, m12, m21, m22, dx, dy)
//The transform() method is used to modify the transformation matrix of the current context.
//ctx.transform(m11, m12, m21, m22, dx, dy)

//The setTransform(a, b, c, d, e, f) method reset the current transform to the identity matrix, and then invoke the transform(a, b, c, d, e, f) method with the same arguments.
//ctx.setTransform(m11, m12, m21, m22, dx, dy)
// Parameters	Type	  Description
// m11	      number	The m1,1 value in the matrix. [Increases or decreases the size of the pixels horizontally.]
// m12	      number	The m1,2 value in the matrix. [This effectively angles the X axis up or down.]
// m21	      number	The m2,1 value in the matrix. [This effectively angles the Y axis left or right.]
// m22	      number	The m2,2 value in the matrix. [Increases or decreases the size of the pixels vertically.]
// dx	        number	The delta x (dx) value in the matrix. [Moves the whole coordinate system horizontally]
// dy	        number	The delta y (dy) value in the matrix. [Moves the whole coordinate system vertically.]
