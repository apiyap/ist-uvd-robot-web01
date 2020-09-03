import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getUserLogingIn,
  authPass,
  //   updateLogin,
  //   updateErrorLogin
} from "../../features/Auth/AuthSlice";
import { Button, Form, InputGroup, Image } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../logo.svg";

import { useTranslation, Trans } from "react-i18next";

export default function CheckPass(props) {
  const { t } = useTranslation();

  useEffect(() => {
    // if(!props.fetched) {
    //     props.fetchRules();
    // }
    if (!document.body.classList.contains("hold-transition")) {
      document.body.classList.add("hold-transition");
    }
    if (!document.body.classList.contains("lockscreen")) {
      document.body.classList.add("lockscreen");
    }
    textInput.current.focus();
  }, []); // passing an empty array as second argument triggers the callback in useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour

  const textInput = useRef(null);
  const [validated, setValidated] = useState(false);
  const user = useSelector((state) => getUserLogingIn(state));
  const dispatch = useDispatch();
  let history = useHistory();

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
      object[name] = data.get(name);
    }

    try {
      const resultAction = await dispatch(
        authPass({ url: user.url, data: { ...object, ...user } })
      );
      unwrapResult(resultAction);
      if (resultAction.payload.error) {
        console.log(resultAction.payload.error_description);
        toastr.error(t("checkpass.error.title"), t("checkpass.error.description"));
        form.reset();
        history.push("/login");
      } else if (resultAction.payload.access_token) {
        //console.log(resultAction.payload)
        history.push("/dashboard");
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
      {/* Automatic element centering */}
      <div className="lockscreen-wrapper">
        <div className="lockscreen-logo">
          <Link to="/">
            <Image src={logo} fluid />
            <b>UVD</b> Robot
          </Link>
        </div>
        {/* User name */}
        <div className="lockscreen-name">{user.client_id}</div>
        {/* START LOCK SCREEN ITEM */}
        <div className="lockscreen-item">
          {/* lockscreen image */}
          <div className="lockscreen-image">
            <FontAwesomeIcon icon={["fas", "key"]} size="4x" color="#ff9900" />
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
                name="client_secret"
                type="password"
                placeholder="Password"
                ref={textInput}
              />
              <Button type="submit">
                <FontAwesomeIcon
                  icon={["fas", "arrow-right"]}
                  color="#008080"
                />
              </Button>
              <Form.Control.Feedback type="invalid">
                <Trans i18nKey="checkpass.invalid">
                  Please enter valid password.
                </Trans>
              </Form.Control.Feedback>
            </InputGroup>
          </Form>
          {/* /.lockscreen credentials */}
        </div>
        {/* /.lockscreen-item */}
        <div className="help-block text-center">
          <Trans i18nKey="checkpass.detail">
            {" "}
            Enter your password to retrieve your session{" "}
          </Trans>
        </div>
        <div className="text-center">
          <Link to="/login">
            <Trans i18nKey="checkpass.login">
              Or sign in as a different user
            </Trans>
          </Link>
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
    </>
  );
}
