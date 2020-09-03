import {
    createSlice,
    // nanoid,
    //createAsyncThunk,
    // createSelector,
    // createEntityAdapter,
  } from "@reduxjs/toolkit";

  const initialState = {
    showWebcam: false,
    width : 320,
    height : 240,
  };

  const webcamSlice = createSlice({
    name: "webcam",
    initialState,
    reducers: {
      updateShowWebcam(state, action) {
        state.showWebcam = action.payload;
      },
      updateWebcamSize(state, action) {
        const { width, height } = action.payload;
        state.width = width;
        state.height = height;
      },
    },
    extraReducers: {},
  });
  export const {
    updateShowWebcam,
    updateWebcamSize,

  } = webcamSlice.actions;
  export default webcamSlice.reducer;
  
  export const getShowWebcam = (state) => state.webcam.showWebcam;
  export const getWebcamWidth = (state) => state.webcam.width;
  export const getWebcamHeight = (state) => state.webcam.height;