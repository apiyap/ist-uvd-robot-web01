import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getAuthUser } from "../../features/Auth/AuthSlice";
import { getIsConnected, updateConnected, rosConnect, Ros } from "../../features/Ros/rosSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function TopNavbar(props) {
  const [showComment, setShowComment] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const user = useSelector((state) => getAuthUser(state));
  const rosConnected = useSelector((state) => getIsConnected(state));
  const dispatch = useDispatch();
  
  const connection = rosConnected ? (
    <Link
      className="nav-link"
      onClick={() => {
        props.menuClick("connected");
      }}
    >
      <FontAwesomeIcon
        className="text-success"
        icon={["fas", "spinner"]}
        spin
      />{" "}
      Connected
    </Link>
  ) : (
    <Link
      className="nav-link"
      onClick={() => {
        if (!rosConnected) dispatch(rosConnect(user));
        props.menuClick("disconnected");
      }}
    >
      <FontAwesomeIcon
        className="text-danger"
        icon={["fas", "exclamation-circle"]}
      />{" "}
      Disconnected
    </Link>
  );

  return (
    <nav className="main-header navbar navbar-expand navbar-dark navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="pushmenu"
            href="#"
            role="button"
            onClick={() => {
              props.menuClick("leftmenu");
            }}
          >
            <FontAwesomeIcon icon={["fas", "bars"]} />
          </a>
        </li>

        <li className="nav-item d-none d-sm-inline-block">{connection}</li>
      </ul>
      {/* SEARCH FORM */}

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Messages Dropdown Menu */}
        <li
          className={"nav-item dropdown" + (showComment ? " show" : "")}
          onClick={() => {
            setShowComment(!showComment);
            setShowNotify(false);
          }}
        >
          <a className="nav-link" data-toggle="dropdown" href="#">
            <FontAwesomeIcon icon={["far", "comments"]} />
            <span className="badge badge-danger navbar-badge">3</span>
          </a>
          <div
            className={
              "dropdown-menu dropdown-menu-lg dropdown-menu-right" +
              (showComment ? " show" : "")
            }
          >
            <a href="#" className="dropdown-item">
              {/* Message Start */}
              <div className="media">
                <img
                  data-src="holder.js/50px50?text= &bg=373940"
                  alt="User Avatar"
                  className="img-size-50 mr-3 img-circle holderjs"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Brad Diesel
                    <span className="float-right text-sm text-danger">
                      <i className="fas fa-star" />
                    </span>
                  </h3>
                  <p className="text-sm">Call me whenever you can...</p>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1" /> 4 Hours Ago
                  </p>
                </div>
              </div>
              {/* Message End */}
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              {/* Message Start */}
              <div className="media">
                <img
                  data-src="holder.js/128px128?text= &bg=373940"
                  alt="User Avatar"
                  className="img-size-50 img-circle mr-3 holderjs"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    John Pierce
                    <span className="float-right text-sm text-muted">
                      <i className="fas fa-star" />
                    </span>
                  </h3>
                  <p className="text-sm">I got your message bro</p>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1" /> 4 Hours Ago
                  </p>
                </div>
              </div>
              {/* Message End */}
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              {/* Message Start */}
              <div className="media">
                <img
                  data-src="holder.js/128px128?text= &bg=373940"
                  alt="User Avatar"
                  className="img-size-50 img-circle mr-3 holderjs"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Nora Silvester
                    <span className="float-right text-sm text-warning">
                      <i className="fas fa-star" />
                    </span>
                  </h3>
                  <p className="text-sm">The subject goes here</p>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1" /> 4 Hours Ago
                  </p>
                </div>
              </div>
              {/* Message End */}
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item dropdown-footer">
              See All Messages
            </a>
          </div>
        </li>
        {/* Notifications Dropdown Menu */}
        <li
          className={"nav-item dropdown" + (showNotify ? " show" : "")}
          onClick={() => {
            setShowNotify(!showNotify);
            setShowComment(false);
          }}
        >
          <a className="nav-link" data-toggle="dropdown" href="#">
            <FontAwesomeIcon icon={["far", "bell"]} />
            <span className="badge badge-warning navbar-badge">15</span>
          </a>
          <div
            className={
              "dropdown-menu dropdown-menu-lg dropdown-menu-right" +
              (showNotify ? " show" : "")
            }
          >
            <span className="dropdown-item dropdown-header">
              15 Notifications
            </span>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <i className="fas fa-envelope mr-2" /> 4 new messages
              <span className="float-right text-muted text-sm">3 mins</span>
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <i className="fas fa-users mr-2" /> 8 friend requests
              <span className="float-right text-muted text-sm">12 hours</span>
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <i className="fas fa-file mr-2" /> 3 new reports
              <span className="float-right text-muted text-sm">2 days</span>
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item dropdown-footer">
              See All Notifications
            </a>
          </div>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="pushmenu"
            href="#"
            role="button"
            onClick={() => {
              setShowComment(false);
              setShowNotify(false);
              props.menuClick("logout");
            }}
          >
            <FontAwesomeIcon icon={["fas", "sign-out-alt"]} />
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="control-sidebar"
            data-slide="true"
            href="#"
            role="button"
            onClick={() => {
              setShowComment(false);
              setShowNotify(false);
              props.menuClick("controlbar");
            }}
          >
            <FontAwesomeIcon icon={["fas", "th-large"]} />
          </a>
        </li>
      </ul>
    </nav>
  );
}
