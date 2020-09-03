import { fabric } from "fabric";

// import {Square, H5Canvas , SquareBitmap} from '../H5Canvas/index';
// import {OccupancyGridClient} from '../H5Canvas/OccupancyGridClient';

//import { Editor } from "../Editor";

var LabeledRect = fabric.util.createClass(fabric.Rect, {
  type: "labeledRect",
  // initialize can be of type function(options) or function(property, options), like for text.
  // no other signatures allowed.
  initialize: function (options) {
    options || (options = {});

    this.callSuper("initialize", options);
    this.set("label", options.label || "");
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      label: this.get("label"),
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);

    ctx.font = "20px Helvetica";
    ctx.fillStyle = "#333";
    ctx.fillText(this.label, -this.width / 2, -this.height / 2 + 20);
  },
});

var OccupancyGridClient = fabric.util.createClass(fabric.Image, {
  type: "OccupancyGridClient",

  initialize: function (options) {
    options || (options = {});

    this.callSuper("initialize", options);
    this.set("OccupancyGridClient", options.OccupancyGridClient || "");

    this.setElement();
    var ros = options.ros;
    var topic = options.topic || "/map";
    this.continuous = options.continuous;
    this.ctx = options.ctx;

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
  },

  getRobotPosition: function (msg) {
    console.log("getRobotPosition:");
    this.robotTf = new ROSLIB.Transform(msg);
    console.log(this.robotTf);
    var rot = this.rosQuaternionToGlobalTheta(this.robotTf.rotation);
    console.log(rot);
  },
  messageCallback: function (message) {
    this.message = message; //save message
    this.isRecieved = true;
    // console.log("recived:" + this.continuous);
    console.log(this.message);
    // save the metadata we need
    this.pose = new ROSLIB.Pose({
      position: this.message.info.origin.position,
      orientation: this.message.info.origin.orientation,
    });

    // set the size
    this.width = this.message.info.width;
    this.height = this.message.info.height;

    this.imgData = this.ctx.createImageData(this.width, this.height);

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
    //ImageBitmap
   // this.setElement(createImageBitmap(this.imgData,0,0,this.width,this.height));
    // change Y direction
    //this.y = -this.height * this.message.info.resolution;

    // scale the image
    this.scaleX = this.message.info.resolution;
    this.scaleY = this.message.info.resolution;
    // check if we should unsubscribe
    if (!this.continuous) {
      if (this.rosTopic) this.rosTopic.unsubscribe();
    }
  },
  rosQuaternionToGlobalTheta: function (orientation) {
    // See https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Rotation_matrices
    // here we use [x y z] = R * [1 0 0]
    var q0 = orientation.w;
    var q1 = orientation.x;
    var q2 = orientation.y;
    var q3 = orientation.z;

    return -Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3)); //  * 180.0 / Math.PI;// Canvas rotation is clock wise and in degrees
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      OccupancyGridClient: this.get("OccupancyGridClient"),
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);
    if (this.imgData !== null)
    ctx.putImageData(this.imgData, this.top, this.left);

    // ctx.font = "20px Helvetica";
    // ctx.fillStyle = "#333";
    // ctx.fillText("TESTESTST", -this.width / 2, -this.height / 2 + 20);
  },
});