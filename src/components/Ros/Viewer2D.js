import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  getIsConnected,
  updateConnected,
  rosConnect,
  Ros,
} from "../../features/Ros/rosSlice";
import {
  getLockRobotCenterView,
  getAutoRotateView,
} from "../../features/joystickSlice";

import * as ROSLIB from "roslib";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavCanvas } from "./NavCanvas";
import { OccupancyGridClient } from "./NavCanvas/Objects/OccupancyGridClient";
import { Square } from "./NavCanvas/Objects/Square";

import { number, func } from "prop-types";

import {
  Button,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { useTranslation, Trans } from "react-i18next";

export const Viewer2D = forwardRef((props, ref) => {
  const [viewHeight, setViewHeight] = useState(400);
  const [viewWidth, setViewWidth] = useState(400);
  const [showToolbar, setShowToolbar] = useState(true);
  
  const [activeTool, setActiveTool] = useState('NONE');


  const [saveModelShow, setSaveModelShow] = useState(false);
  const [saveValidated, setSaveValidated] = useState(false);
  const textInput = useRef(null);

  const [openModelShow, setOpenModelShow] = useState(false);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const viewRef = useRef(null);
  const viewToolbarRef = useRef(null);
  const editorRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const gridClientRef = useRef(null);

  const WindowSize = useCallback(() => {
    if (viewRef.current !== null) {
 
      setViewHeight(viewRef.current.offsetHeight - 30 - (showToolbar?38 : 0));

      if (editorRef.current !== null) {
        setViewWidth(editorRef.current.offsetWidth - 20);
      }
    }
  }, [viewRef, editorRef, canvasRef, setViewWidth, setViewHeight,showToolbar]);

  useEffect(() => {
    // Create the main viewRef.current.
    console.log("Create default viewRef.current.");

    if (canvasRef.current !== null) {
      if (canvasRef.current.getContext) {
        if (engineRef.current === null) {
          engineRef.current = new NavCanvas("canvas");
        }
      } else {
        console.error("Cant draw canvas");
      }
    }

    window.addEventListener("resize", WindowSize);
    WindowSize();
    //gameLoop(0);

    if (engineRef.current != null) {
      gridClientRef.current = new OccupancyGridClient(
        engineRef.current,
        40,
        40,
        {
          ros: Ros,
          continuous: true,
          width: 0.64,
          height: 0.64,
        }
      );

      engineRef.current.canvasObjects = [
        // new Square(engineRef.current, 250, 150, 50, 50 , 1 , 1),
        // new Square(engineRef.current, 350, 75, 50, 50, -1 ,1),
        // new Square(engineRef.current, 300, 300, 50, 50, 1 , -1),
        // new SquareBitmap(engineRef.current, 10, 10, 80, 50, 200 , 200),
        gridClientRef.current,
        //new Square(engineRef.current, 450, 450, 50, 50, 1, 1),
      ];
      engineRef.current.init();
    }

    return () => {
      window.removeEventListener("resize", WindowSize);
      engineRef.current.exit();
    };
  }, [dispatch, WindowSize, viewRef]);

  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Viewer");
    },
    setCenterView(v) {
      if (engineRef.current !== null) {
        engineRef.current.autoRobotCenter = v;
      }
    },
    setAutoRotate(v) {
      if (engineRef.current !== null) {
        engineRef.current.autoRotation = v;
      }
    },
    setToolbar(e){
      setShowToolbar(e);
      WindowSize();
    },

  }));

  function rotateLeft() {
    if (engineRef.current !== null) {
      engineRef.current.rotateViewLeft();
    }
  }

  function rotateRight() {
    if (engineRef.current !== null) {
      engineRef.current.rotateViewRight();
    }
  }

  function serachLocationt() {
    if (engineRef.current !== null) {
      engineRef.current.viewToRobot();
    }
  }

  const handleSaveClose = () => {
    setSaveModelShow(false);
  };
  const handleSaveShow = () => {
    setSaveValidated(false);
    setSaveModelShow(true);
  };
  const handleSaveSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setSaveValidated(true);
      return;
    }
    console.log(textInput.current.value);
    setSaveModelShow(false);
    gridClientRef.current.saveMap(textInput.current.value).then((result) => {
      console.log(result);
    });
  };

  const handleOpenShow = () => {
    setOpenModelShow(true);
  };

  const handleOpenClose = () => {
    setOpenModelShow(false);
  };

 
  const setEngineActiveTool = (v) =>{
    
    if (engineRef.current !== null) {
      engineRef.current.setActiveTool(v);
      setActiveTool(engineRef.current.activeTool);
    }
  }

  return (
    <div ref={viewRef} className="container-fluid">
      <div ref={editorRef} className="col-12">
        <div className="editor">
          <div ref={viewToolbarRef} style={{display:(showToolbar? 'block' : 'none')}}>
            <button
              type="button"
              className="btn btn-primary float-left mr-2"
              onClick={rotateLeft}
            >
              <FontAwesomeIcon
                icon={["fas", "level-down-alt"]}
                flip="horizontal"
              />
            </button>

            <div className="btn-group mr-2">
              <button
                type="button"
                className="btn btn-default btn-flat"
                onClick={handleOpenShow}
              >
                <FontAwesomeIcon icon={["fas", "folder-open"]} />
              </button>
              <button
                type="button"
                className="btn btn-default btn-flat"
                onClick={handleSaveShow}
              >
                <FontAwesomeIcon icon={["fas", "save"]} />
              </button>
              <button
                type="button"
                className="btn btn-default btn-flat"
                onClick={serachLocationt}
              >
                <FontAwesomeIcon icon={["fas", "crosshairs"]} />
              </button>
            </div>

            <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className={"btn bg-olive" + (activeTool==='NONE'? " active" : '' )} onClick={()=>setEngineActiveTool('NONE')}>
                <input
                  type="radio"
                  name="options"
                  id="option1"
                  autoComplete="off"
                  defaultChecked
                />{" "}
                <FontAwesomeIcon icon={["fas", "ban"]} />
              </label>

              <label className={"btn bg-olive" + (activeTool==='ZOOMPAN'? " active" : '' )} onClick={()=>setEngineActiveTool('ZOOMPAN')}>
                <input
                  type="radio"
                  name="options"
                  id="option1"
                  autoComplete="off"
                  defaultChecked
                />{" "}
                <FontAwesomeIcon icon={["fas", "search-location"]} />
              </label>
              <label className={"btn bg-olive" + (activeTool==='ROUTE'? " active" : '' )} onClick={()=>setEngineActiveTool('ROUTE')}>
                <input
                  type="radio"
                  name="options"
                  id="option2"
                  autoComplete="off"
                />{" "}
                <FontAwesomeIcon icon={["fas", "route"]} />
              </label>
            </div>

            <button
              type="button"
              className="btn btn-primary float-right"
              onClick={rotateRight}
            >
              <FontAwesomeIcon icon={["fas", "level-down-alt"]} />
            </button>
          </div>

          <canvas
            ref={canvasRef}
            id="canvas"
            className="canvas"
            width={viewWidth}
            height={viewHeight}
          >
            ): Your browser does not support the HTML5 canvas tag.
          </canvas>

          <Modal
            show={saveModelShow}
            onHide={handleSaveClose}
            backdrop="static"
            keyboard={false}
          >
            <Form
              noValidate
              validated={saveValidated}
              onSubmit={handleSaveSubmit}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {" "}
                  <FontAwesomeIcon icon={["fas", "map-marked-alt"]} />
                  <span className="mr-1"></span>
                  <Trans i18nKey="viewer2d.save_model.title">Save map </Trans>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <InputGroup>
                  <Form.Control
                    required
                    name="mapname"
                    type="text"
                    placeholder={t("viewer2d.save_model.text")}
                    ref={textInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    <Trans i18nKey="viewer2d.save_model.invalidname">
                      Please enter valid map name.
                    </Trans>
                  </Form.Control.Feedback>
                </InputGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleSaveClose}>
                  <FontAwesomeIcon icon={["fas", "times"]} />{" "}
                  <span className="mr-1"></span>
                  <Trans i18nKey="viewer2d.save_model.buttons.cancel">
                    Cancel
                  </Trans>
                </Button>
                <Button type="submit" variant="primary">
                  {" "}
                  <FontAwesomeIcon icon={["fas", "save"]} />{" "}
                  <span className="mr-1"></span>
                  <Trans i18nKey="viewer2d.save_model.buttons.save">Save</Trans>
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          <Modal
            show={openModelShow}
            backdrop="static"
            keyboard={false}
            onHide={handleOpenClose}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {" "}
                <FontAwesomeIcon icon={["fas", "map-marked-alt"]} />
                <span className="mr-1"></span>
                <Trans i18nKey="viewer2d.open_model.title">Open map </Trans>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="auto">
                <InputGroup>
                  <Form.Group as={Row} controlId="exampleForm.ControlSelect1">
                    <Form.Label>
                      <Trans i18nKey="viewer2d.open_model.text">
                        {" "}
                        Maps select
                      </Trans>
                    </Form.Label>
                    <Form.Control as="select">
                      <option>Map1</option>
                      <option>Map2</option>
                      <option>Map3</option>
                      <option>Map4</option>
                      <option>Map5</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Control.Feedback type="invalid">
                    <Trans i18nKey="viewer2d.open_model.invalidmap">
                      Please select a map.
                    </Trans>
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleOpenClose}>
                <FontAwesomeIcon icon={["fas", "times"]} />{" "}
                <span className="mr-1"></span>
                <Trans i18nKey="viewer2d.open_model.buttons.cancel">
                  Cancel
                </Trans>
              </Button>
              <Button type="submit" variant="primary">
                {" "}
                <FontAwesomeIcon icon={["fas", "folder-open"]} />{" "}
                <span className="mr-1"></span>
                <Trans i18nKey="viewer2d.open_model.buttons.open">Open</Trans>
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
});
