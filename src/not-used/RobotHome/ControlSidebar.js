import React from "react"; //useEffect //useState,
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
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

import { updateShowWebcam, getShowWebcam } from "../../features/webcamSlice";

import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
// import { Donut } from "react-dial-knob";
import Knob from "../Knob";
//import Knob from 'react-canvas-knob';

export default function ControlSidebar(props) {
  const dispatch = useDispatch();
  const showJoy = useSelector((state) => getShowJoystick(state));
  //const robotCeneter = useSelector((state) => getLockRobotCenterView(state));
  const showWebcam = useSelector((state) => getShowWebcam(state));

  const enableJoy = useSelector((state) => getEnabledJoystick(state));
  const relocateJoy = useSelector((state) => getRelocateJoystick(state));
  const velScale = useSelector((state) => getVelScale(state));
  const angScale = useSelector((state) => getAngScale(state));

  return (
    <OverlayScrollbarsComponent>
      <aside className="control-sidebar control-sidebar-dark">
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
                  defaultChecked={showWebcam}
                  onChange={() => {
                    dispatch(updateShowWebcam(!showWebcam));
                  }}
                />
                <Form.Check
                  type="switch"
                  id="lock_robot_center"
                  label="Lock robot center view"
                  defaultChecked={props.robotCeneter}
                  onChange={() => {
                    props.onRobotCenter(!props.robotCeneter);
                  }}
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
            <div className="row">
              <div className="mx-3">
                <h6>Linear velocity.</h6>
                <Knob
                  size={80}
                  numTicks={25}
                  degrees={260}
                  min={1}
                  max={100}
                  value={velScale}
                  color={true}
                  onChange={(e) => {
                    dispatch(updateVelScale(e));
                  }}
                />
              </div>
            </div>
            <div className="row">
              <h1> </h1>
            </div>
            <br />
            <div className="row">
              <div className="mx-3">
                <h6>Angular velocity.</h6>
                <Knob
                  size={80}
                  numTicks={25}
                  degrees={260}
                  min={1}
                  max={100}
                  value={angScale}
                  color={true}
                  onChange={(e) => {
                    dispatch(updateAngScale(e));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </OverlayScrollbarsComponent>
  );
}
