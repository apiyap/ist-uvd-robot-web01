import * as ROSLIB from "roslib";
import { GameObject } from "./index.js";

export class RobotPos extends GameObject {
  constructor(engine, x, y, options) {
    super(engine, x, y, 0, 0);
    options = options || {};
    console.log("RobotPos:");
    console.log(options);
    this.width = options.width;
    this.height = options.height;

    var ros = options.ros;
    var topic = options.topic || "/map";
    this.continuous = options.continuous;


    // Setup a client to listen to TFs.
    this.tfClient = new ROSLIB.TFClient({
      ros: ros,
      angularThres: 0.01,
      transThres: 0.01,
      rate: 10.0,
      fixedFrame: topic,
    });
    this.tfClient.subscribe("/base_link",  this.getRobotPosition);
  }

  exit() {
    if (this.tfClient) this.tfClient.unsubscribe();
  }

  getRobotPosition(msg) {
    console.log("getRobotPosition:");
    var tf = new ROSLIB.Transform(msg);
    console.log(tf);

  }

  update(secondsPassed) {}

  draw() {
    this.engine.context.fillStyle = "#ff8080";
    this.engine.context.fillRect(this.x, this.y, this.width, this.height);
  }
}
