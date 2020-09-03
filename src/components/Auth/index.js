import React, {
  // useLayoutEffect,
  // useState,
  forwardRef, 
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  useHistory,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  // getStatusLogin,
  getAuthUser,
  authUser,
  authLogout,
  authRefresh,
} from "../../features/Auth/AuthSlice";
import {
  // getParams,
  updateWindowSize,
} from "../../features/appSlice";



export const  Auth = forwardRef((props, ref) => {
  const timerRef = useRef(null);
  let history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => getAuthUser(state));
  //const params = useSelector((state) => getParams(state));

  const getWindowSize = useCallback(() => {
    const wSize = { width: window.innerWidth, height: window.innerHeight };
    dispatch(updateWindowSize(wSize));
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(authRefresh({ data: user }));
    console.log("refresh");
  }, [dispatch, user]);

  const getUserData = useCallback(async () => {
    try {
      const resultAction = await dispatch(authUser());
      //unwrapResult(resultAction);
      if (resultAction.payload === null) {
        // console.log(resultAction.payload);
        history.push("/login");
      } else if (resultAction.payload.error) {
        console.log("Error");
        console.log(resultAction.payload);
      } else {
        const timestamp = user.time * 1000;
        if (!isNaN(timestamp)) {
          // console.log(user.time);
          // console.log(timestamp);
          console.log(
            new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(timestamp)
          );

          if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }

          const timeout = (user.expires_in - 600) * 1000; //50 min
          //console.log(timeout);
          timerRef.current = setTimeout(() => {
            console.log("auto token refresh");
            handleRefresh();
          }, timeout);
        }
      }
    } catch (err) {
      console.error("Failed to save the post: ", err);
    } finally {
    }
  }, [dispatch, history, user, handleRefresh]);

  useEffect(() => {
    console.log("useEffect");

    getUserData();
    window.addEventListener("resize", getWindowSize);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      window.removeEventListener("resize", getWindowSize);
    };
  }, [getUserData, getWindowSize]); // passing an empty array as second argument triggers the callback in useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour

  const handleLogout = useCallback(
    () => {
      console.log("logout");
      try {
        const resultAction = dispatch(authLogout());
        unwrapResult(resultAction);
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        history.push("/login");
      } catch (err) {
        console.error("Failed to save the post: ", err);
      } finally {
      }
    },
    [dispatch, history]
  );

  useImperativeHandle(ref, () => ({

    getAlert() {
      alert("getAlert from Auth");
    },
    logout(){
        handleLogout();
    }

  }));
  return <></>;
}
);



/* Example for class
const { Component } = React;

class Parent extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  onClick = () => {
    this.child.current.getAlert();
  };

  render() {
    return (
      <div>
        <Child ref={this.child} />
        <button onClick={this.onClick}>Click</button>
      </div>
    );
  }
}

class Child extends Component {
  getAlert() {
    alert('getAlert from Child');
  }

  render() {
    return <h1>Hello</h1>;
  }
}

*/