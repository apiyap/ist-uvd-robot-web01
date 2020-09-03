import { ToolObject } from "../ToolObject";


export class ToolRoute extends ToolObject {
  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.ros || "ROUTE";
    this.icon = ["fas", "route"];
  }
}