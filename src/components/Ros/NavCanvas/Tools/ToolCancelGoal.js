import { ToolObject } from "../ToolObject";


export class ToolCancelGoal  extends ToolObject  {
    constructor(engine,options) {
      super(engine, options);
      
      options = options || {};
      this.name = options.ros || "CANCELGOAL";
      this.icon = ["fas", "times-circle"];
      this.visible = true;
      this.enabled = true;
    }

    draw(tr) {}
    update(t) {}
    exit() {}

    
    getName(){
        return this.name;
    }
    getCursor(){
      return 'none';
    }

    onMouseDown(e){

    }

    onMouseMove(e){

    }

    onMouseUp(e){

    }
    onMouseWheel(e){

    }
    onTouchStart(e){

    }
    onTouchMove(e){

    }
    onTouchEnd(e){

    }



}