import React ,{
useRef,
}from "react";
// import RobotHome from "../RobotHome";
import Dashboard from "../Robot/Dashboard";

import {Auth} from "../Auth";

function Home(props) {

  function handleLogout(e){
    if(e)e.preventDefault();
    authRef.current.logout()
  }
  const authRef = useRef();
  return (
    < >
      <Auth ref={authRef} />
      {/* <RobotHome logout={handleLogout}/> */}
      <Dashboard/>
    </>
  );
}

export default Home;
