import React  , {   useState,  useEffect} from "react";
import Draggable from "react-draggable";
import {  Image,   } from "react-bootstrap";
import { useDispatch , useSelector } from "react-redux";
import {
    // updateShowWebcam,
    // updateWebcamSize,
    getShowWebcam,
    getWebcamWidth,
    getWebcamHeight
  } from "../../features/webcamSlice";



export default function WebCam(props) {
    const dispatch = useDispatch();
    const width = useSelector((state) => getWebcamWidth(state));
    const height = useSelector((state) => getWebcamHeight(state));
    const showWebcam = useSelector((state) => getShowWebcam(state));

    const [videoSrc, setVideoSrc] = useState('');


 

  useEffect(()=>{

    //const topic = "/camera/color/image_raw";  //rgb
    const topic = "/depthcam/depth/image_raw";  //depth
    ///
    // create the image to hold the stream
    var src = "http://"+window.location.hostname + ":8080/stream?topic=" + topic;
    // add various options
    src += "&width=" + width;
    src += "&height=" + height;

    setVideoSrc(src);
    console.log(videoSrc)

  },[setVideoSrc, width,height ] )
 
  function OnStopDrag() {}

    return (

      <Draggable onStop={OnStopDrag} disabled={!showWebcam} >
        <div className="webcam"
          style={{
            width: width,
            height: height,
            display:(showWebcam?"block":"none") ,
          }}
        >
           <Image src={videoSrc} style={{
            width: width,
            height: height,
            display:(showWebcam?"block":"none") ,
          }} />
        </div>
      </Draggable>
    );
  
}
