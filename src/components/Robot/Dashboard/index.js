import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../Frame";
import ControlSidebar from "./ControlSidebar";


export default function Dashboard(props) {

  return (
    <>
      <Frame>
        <div className="container-fluid">
          <div className="col-12">
            {/* Small boxes (Stat box) */}
            <div className="row">
              <div className="col-lg-4 col-4">
                {/* small box */}
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>50</h3>
                    <p>Rooms registered</p>
                  </div>
                  <div className="icon">
                    <i className="ion">
                      <FontAwesomeIcon icon={["fas", "city"]} />
                    </i>
                  </div>
                  <a href="#" className="small-box-footer">
                    More info{" "}
                    <FontAwesomeIcon icon={["fas", "arrow-circle-right"]} />
                  </a>
                </div>
              </div>
              {/* ./col */}
              <div className="col-lg-4 col-4">
                {/* small box */}
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>
                      53<sup style={{ fontSize: 20 }}>%</sup>
                    </h3>
                    <p>Battery remaining</p>
                  </div>
                  <div className="icon">
                    <i className="ion">
                      <FontAwesomeIcon icon={["fas", "battery-half"]} />
                    </i>
                  </div>
                  <a href="#" className="small-box-footer">
                    More info{" "}
                    <FontAwesomeIcon icon={["fas", "arrow-circle-right"]} />
                  </a>
                </div>
              </div>
              {/* ./col */}
              <div className="col-lg-4 col-4">
                {/* small box */}
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>
                      80 <sup style={{ fontSize: 20 }}>%</sup>
                    </h3>
                    <p>UVC lamps remaining</p>
                  </div>
                  <div className="icon">
                    <i className="ion">
                      <FontAwesomeIcon icon={["fas", "lightbulb"]} />
                    </i>
                  </div>
                  <a href="#" className="small-box-footer">
                    More info{" "}
                    <FontAwesomeIcon icon={["fas", "arrow-circle-right"]} />
                  </a>
                </div>
              </div>
              {/* ./col */}
            </div>
            {/* /.row */}

            <div className="canvas" style={{height:400}}>

            </div>

            <br/>

            {/* Info boxes */}
            <div className="row">
            

              <div className="col-lg-4 col-4">
                <div className="info-box">
                  <span className="info-box-icon bg-info elevation-1">
                    <FontAwesomeIcon icon={["fas", "charging-station"]} />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">Go to Dock station</span>
                    <span className="info-box-number">
                      ~10
                      <small>m.</small>
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              {/* /.col */}
              <div className="col-lg-4 col-4">
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-danger elevation-1">
                  <FontAwesomeIcon icon={["fas", "tablet-alt"]} />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">Run screen</span>
                    <span className="info-box-number"></span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              {/* /.col */}
              <div className="col-lg-4 col-4">
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-success elevation-1">
                    <FontAwesomeIcon icon={["fas", "virus-slash"]} />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">Start disinfacted</span>
                    <span className="info-box-number">50 rooms</span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>

            </div>
            {/* /.row */}
          </div>
        </div>
      </Frame>
      <ControlSidebar />
    </>
  );
}
