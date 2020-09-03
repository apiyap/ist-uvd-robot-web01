import React ,{useRef , useEffect}from "react";
/* import { getLockRobotCenterView } from "../../features/joystickSlice";
import { useSelector, useDispatch } from "react-redux"; */
import Robot from "../Ros";

export default function ContentWrapper(props) {
  //const robotCeneter = useSelector((state) => getLockRobotCenterView(state));
  const robotRef = useRef();
  useEffect(()=>{
    robotRef.current.setCenterView(props.robotCeneter);
  },[robotRef])

  return (
    <div className="content-wrapper bg-gray">
      <section className="content">
        <Robot ref={robotRef} />
      </section>
    </div>
  );
}
