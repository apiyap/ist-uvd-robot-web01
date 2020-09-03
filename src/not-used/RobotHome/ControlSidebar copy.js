import React from //useState,
//useEffect
"react";
import {
  updateShowJoystick,
  setRobotCenterView,
  updateEnabledJoystick,
  updateRelocateJoystick,
  updateVelScale,
  updateAngScale,
  getShowJoystick,
  getLockRobotCenterView,
  getEnabledJoystick,
  getRelocateJoystick,
  getVelScale,
  getAngScale,
} from "../../features/joystickSlice";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
// import { Donut } from "react-dial-knob";
//import Knob from "../Knob";
import Knob from 'react-canvas-knob';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';


export default function ControlSidebar(props) {
  const dispatch = useDispatch();
  const showJoy = useSelector((state) => getShowJoystick(state));
  //const robotCeneter = useSelector((state) => getLockRobotCenterView(state));

  const enableJoy = useSelector((state) => getEnabledJoystick(state));
  const relocateJoy = useSelector((state) => getRelocateJoystick(state));
  const velScale = useSelector((state) => getVelScale(state));
  const angScale = useSelector((state) => getAngScale(state));

  return (
    
    <aside className="control-sidebar control-sidebar-dark">
      <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: 'scroll' } }}>
      <div>
        <h5>Robot Control</h5>
        <div className="card-tools">
          <h6>Display</h6>
          <Form>
            <Form.Group>
              <Form.Check
                type="switch"
                id="show_robot_camera"
                label="Show robot camera"
                defaultChecked={false}
              />
              <Form.Check
                type="switch"
                id="lock_robot_center"
                label="Lock robot center view"
                defaultChecked={props.robotCeneter}
                onChange={()=>{props.onRobotCenter(!props.robotCeneter)}}
              />
              <Form.Check
                type="switch"
                id="show_robot_joystick"
                label="Show robot joystick"
                defaultChecked={showJoy}
                onChange={() => {
                  dispatch(updateShowJoystick(!showJoy));
                }}
              />
            </Form.Group>
          </Form>
        </div>
        <div className="card-tools">
          <h6>Options</h6>
          <Form>
            <Form.Group>
              <Form.Check
                className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success"
                type="switch"
                id="enable_joystick"
                label="Enabled joystick"
                defaultChecked={enableJoy}
                onChange={() => {
                  dispatch(updateEnabledJoystick(!enableJoy));
                }}
              />
              <Form.Check
                type="switch"
                id="relocate_joystick"
                label="Relocate joystick"
                defaultChecked={relocateJoy}
                onChange={() => {
                  dispatch(updateRelocateJoystick(!relocateJoy));
                }}
              />
            </Form.Group>
          </Form>
        </div>
        <div id="robot_cmdVel" className="card-tools">
          <h6>Velocity command</h6>
          <div className="d-flex ">
            <div className="slider-red mx-3">
              <p>Linear vel.</p>
              <Knob
                width={60}
                height={60}
                thickness={0.36}
                min={1}
                max={100}
                step={1}
                skin="tron"
                fgColor="#3c8dbc"
                readonly={false}
                disableTextInput={true}
                value={velScale}
                angleArc={250}
                angleOffset={-125}
                onChange={(e)=>{ dispatch(updateVelScale(e));}}

              />
            </div>
            <div className="slider-blue mx-3">
              <p>Angular vel.</p>
              <Knob
                width={60}
                height={60}
                thickness={0.36}
                min={1}
                max={100}
                step={1}
                skin="tron"
                fgColor="#3c8dbc"
                readonly={false}
                disableTextInput={true}
                value={angScale}
                angleArc={250}
                angleOffset={-125}
                onChange={(e)=>{ dispatch(updateAngScale(e));}}
              />
            </div>
          </div>
        </div>
      </div>
      </OverlayScrollbarsComponent>
    </aside>
    
  );
}
