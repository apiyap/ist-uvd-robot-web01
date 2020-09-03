
export class ToolObject {
    constructor(engine,options) {
      this.engine = engine;
      options = options || {};
      this.name = options.ros || "NONE";
      this.icon = ["fas", "ban"];
    }

    getName(){
        return this.name;
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