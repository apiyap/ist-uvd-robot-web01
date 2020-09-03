import React, { useState, useEffect, useRef } from "react";
import logo from "../../logo.svg";
import "../../App.css";
import "../../scss/login.scss";

import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import { authPost, getUserLogingIn } from "../../features/Auth/AuthSlice";
import { Link, useHistory } from "react-router-dom";
import { toastr } from "react-redux-toastr";

import { Button, Form, InputGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTranslation, Trans } from "react-i18next";

//import getMAC, { isMAC } from "getmac";

function Login(props) {
  const { t } = useTranslation();

  // // Fetch the computer's MAC address
  // console.log(getMAC());

  // // Fetch the computer's MAC address for a specific interface
  // console.log(getMAC("eth0"));

  // // Validate that an address is a MAC address
  // if (isMAC("e4:ce:8f:5b:a7:fc")) {
  //   console.log("valid MAC");
  // } else {
  //   console.log("invalid MAC");
  // }

  useEffect(() => {
    if (!document.body.classList.contains("hold-transition")) {
      document.body.classList.add("hold-transition");
    }
    if (!document.body.classList.contains("lockscreen")) {
      document.body.classList.add("lockscreen");
    }
    textInput.current.focus();
  }, []); // passing an empty array as second argument triggers the callback in useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour

  const textInput = useRef(null);

  const inputParsers = {
    date(input) {
      const [month, day, year] = input.split("/");
      return `${year}-${month}-${day}`;
    },
    uppercase(input) {
      return input.toUpperCase();
    },
    lowercase(input) {
      return input.toLowerCase();
    },
    number(input) {
      return parseFloat(input);
    },
  };

  let history = useHistory();
  //let location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => getUserLogingIn(state));

  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    const data = new FormData(form);
    var object = {};

    for (let name of data.keys()) {
      const input = form.elements[name];
      const parserName = input.dataset.parse;

      if (parserName) {
        const parser = inputParsers[parserName];
        const parsedValue = parser(data.get(name));
        //console.log("name:" + name +" = " +parsedValue )
        object[name] = parsedValue;
      }
    }

    try {
      const resultAction = await dispatch(
        authPost({ url: "/api/request", data: object })
      );
      unwrapResult(resultAction);
      //console.log(resultAction.payload)
      if (resultAction.payload.error) {
        toastr.error( t("login.error") ,
          resultAction.payload.client_id ,
      );
        form.reset();
      } else if (resultAction.payload.url) {
        history.push("/checkpass");
      } else {
        toastr.error("Unknow error!");
      }
    } catch (err) {
      console.error("Failed to save the post: ", err);
    } finally {
    }
  };

  return (
    <>
     <div className="App">
       
      {/* Automatic element centering */}
      <div className="lockscreen-wrapper">
        <div className="lockscreen-logo">
          <Link to="/">
            <Image src={logo} fluid />
            <b>UVD</b> Robot
          </Link>
        </div>
        {/* User name */}

        <div className="lockscreen-name">
          <Trans i18nKey="login.title">User login</Trans>
        </div>

        {/* START LOCK SCREEN ITEM */}
        <div className="lockscreen-item">
          {/* lockscreen image */}
          <div className="lockscreen-image">
            <FontAwesomeIcon
              icon={["fas", "users"]}
              size="4x"
              color="#008080"
            />
          </div>
          {/* /.lockscreen-image */}
          {/* lockscreen credentials (contains the form) */}
          <Form
            className="lockscreen-credentials"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <InputGroup>
              <Form.Control
                required
                name="email"
                type="email"
                placeholder={t("login.email")}
                data-parse="lowercase"
                defaultValue={user.client_id}
                ref={textInput}
              />
              <Button type="submit">
                <FontAwesomeIcon
                  icon={["fas", "arrow-right"]}
                  color="#008080"
                />
              </Button>
              <Form.Control.Feedback type="invalid">
                <Trans i18nKey="login.invalid">Please enter valid email.</Trans>
              </Form.Control.Feedback>
            </InputGroup>
          </Form>
          {/* /.lockscreen credentials */}
        </div>
        {/* /.lockscreen-item */}
        <div className="help-block text-center">
          <Trans i18nKey="login.detail">
            Enter your password to retrieve your session
          </Trans>
        </div>
        <div className="text-center">
          <a href="/register">
            <Trans i18nKey="login.register">
              {" "}
              Or Register a new membership
            </Trans>
          </a>
        </div>
        
        
        <div className="lockscreen-footer text-center">
          Copyright © 2020 - 2022{" "}
          <b>
            <a
              href="http://www.interface.co.th"
              target="_blank"
              className="text-black"
              rel="noopener noreferrer"
            >
              Interface Systect Co.,LTD.
            </a>
          </b>
          <br />
          All rights reserved
        </div>
      </div>
      {/* /.center */}
      </div>
    </>
  );
}

export default Login;
