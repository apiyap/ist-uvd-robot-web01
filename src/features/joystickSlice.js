import {
  createSlice,
  // nanoid,
  //createAsyncThunk,
  // createSelector,
  // createEntityAdapter,
} from "@reduxjs/toolkit";

const initialState = {
  showJoystick: false,
  lockRobotCenterView : true,
  autoRotateView : true,
  enabledJoystick: false,
  relocateJoystick: false,
  velScale: 15,
  angScale: 15,
};

const joySlice = createSlice({
  name: "joy",
  initialState,
  reducers: {
    updateShowJoystick(state, action) {
      state.showJoystick = action.payload;
    },
    setRobotCenterView(state, action) {
      state.lockRobotCenterView = action.payload;
    },
    setAutoRotateView(state, action) {
      state.autoRotateView = action.payload;
    },
    updateEnabledJoystick(state, action) {
      state.enabledJoystick = action.payload;
    },
    updateRelocateJoystick(state, action) {
      state.relocateJoystick = action.payload;
    },
    updateVelScale(state, action) {
      state.velScale = action.payload;
    },
    updateAngScale(state, action) {
      state.angScale = action.payload;
    },
  },
  extraReducers: {},
});

export const {
  updateShowJoystick,
  setRobotCenterView,
  setAutoRotateView,
  updateEnabledJoystick,
  updateRelocateJoystick,
  updateVelScale,
  updateAngScale
} = joySlice.actions;
export default joySlice.reducer;

export const getShowJoystick = (state) => state.joy.showJoystick;
export const getLockRobotCenterView = (state) => state.joy.lockRobotCenterView;
export const getAutoRotateView = (state) => state.joy.autoRotateView;

export const getEnabledJoystick = (state) => state.joy.enabledJoystick;
export const getRelocateJoystick = (state) => state.joy.relocateJoystick;

export const getVelScale = (state) => state.joy.velScale;
export const getAngScale = (state) => state.joy.angScale;

