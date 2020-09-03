import React  from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import './App.css'

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import CheckPass from "./components/CheckPass";
// import Home from "./components/Home";
import Dashboard from "./components/Robot/Dashboard";
import Model from "./components/Robot/Model";
import Manual from "./components/Robot/Control/Manual";
import Manual2D from "./components/Robot/Control/Manual2D";

import Auto from "./components/Robot/Control/Auto";
import Dock from "./components/Robot/Control/Dock";

import Options from "./components/Robot/Options";
import Maps from "./components/Robot/Maps";
import CreateMap from "./components/Robot/Maps/Create";
import EditMap from "./components/Robot/Maps/Edit";

import Rooms from "./components/Robot/Rooms";

import Run from "./components/Robot/Run";
import Monitor from "./components/Robot/Monitor";
import Schedule from "./components/Robot/Schedule";
import Users from "./components/Robot/Users";

function App(props) {

  return (
 
     <React.Fragment>
        <Router>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/welcome" component={Welcome} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/checkpass" component={CheckPass} />
            {/* <Route exact path="/home" component={Home} />
             */}
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/model" component={Model} />
            <Route exact path="/manual" component={Manual} />
            <Route exact path="/manual2d" component={Manual2D} />
            <Route exact path="/auto" component={Auto} />
            <Route exact path="/dock" component={Dock} />

            <Route exact path="/options" component={Options} />
            <Route exact path="/maps" component={Maps} />
            <Route exact path="/mapcreate" component={CreateMap} />
            <Route exact path="/mapedit" component={EditMap} />

            <Route exact path="/rooms" component={Rooms} />

            <Route exact path="/run" component={Run} />
            <Route exact path="/monitor" component={Monitor} />
            <Route exact path="/schedule" component={Schedule} />
            <Route exact path="/users" component={Users} />

            <Redirect to="/" />
          </Switch>
        </Router>
      </React.Fragment>

  );
}

export default App;
