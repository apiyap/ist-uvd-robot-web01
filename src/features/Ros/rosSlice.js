import {
  createSlice,
  // nanoid,
  createAsyncThunk,
  // createSelector,
  // createEntityAdapter,
} from "@reduxjs/toolkit";

//import * as ROS3D from "ros3d";
import * as ROSLIB from "roslib";

const initialState = {
  isConnected: false,
  error: null,
};

export const Ros = new ROSLIB.Ros();
 

const Connect = (user) => {
  return new Promise((resolve, reject) => {
    try {
      // Connect to ROS.
      const t = parseInt(new Date().getTime() / 1000);
      //let time = t;
      let timeEnd = t + 1000;
      Ros.on("connection", function () {
        //console.log("Connected to websocket server.");
        resolve(Ros);
        //return ros;
      });
      Ros.on("error", function (error) {
        //console.log("Error connecting to websocket server: ", error);
        reject(error);
        //return null;
      });
      Ros.on("close", function (e) {
        console.log("Connection to websocket server closed.");
        
        reject(e);
        //return null;
      });
      //console.log(user);
      Ros.authenticate(
        user.access_token,
        user.client_id,
        "/home",
        "Piya",
        user.time,
        user.scope,
        timeEnd
      );
      Ros.connect("ws://" + window.location.hostname + ":8080/socket.io/");
    } catch (error) {
      //console.log("Request failed", error);
      reject(error);
    }
  });
};

export const rosConnect = createAsyncThunk(
  "ros/connect",
  // The payload creator receives the partial `{title, content, user}` object
  async (user) => {
    const response = await Connect(user)
      .then((ret) => {
        return ret;
      })
      .then(function (data) {
        //console.log(data);
        return data.isConnected;
      })
      .catch(function (error) {
        //console.log("Request failed", error);
        return false;
      });
    return response;
  }
);

const rosSlice = createSlice({
  name: "ros",
  initialState,
  reducers: {
    updateWindowSize(state, action) {
      // const { width, height } = action.payload;
      // state.params.window.size = { width: width, height: height };
    },
    updateConnected(state, action){
      //console.log(state, action.payload);
      state.isConnected = action.payload;
    },

    // postUpdated(state, action) {
    //     const { id, title, content } = action.payload
    //     const existingPost = state.entities[id]
    //     if (existingPost) {
    //       existingPost.title = title
    //       existingPost.content = content
    //     }
    //   },
    // other reducers
  },
  extraReducers: {
    [rosConnect.fulfilled]: (state, action) => {
      //console.log(action.payload);
      state.isConnected = action.payload;
    },
    [rosConnect.rejected]: (state, action) => {
      console.log("rosConnect.rejected");
      state.isConnected = false;
      state.error = action.payload;
    },
  },
});

export const { updateWindowSize, updateConnected } = rosSlice.actions;
export default rosSlice.reducer;

export const getIsConnected = (state) => state.ros.isConnected;
