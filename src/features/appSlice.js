import {
  createSlice,
  // nanoid,
  // createAsyncThunk,
  // createSelector,
  // createEntityAdapter,
} from "@reduxjs/toolkit";

const initialState = {
  params: {
    window: {
      size: {
        width: 1800,
        height: 400,
      },
      autoCollapseSize: 992,
      leftMenuCollapsed: true,
      leftMenuOpen: false,
      controlsidebarSlide : true,
      controlBarOpen : false,
    },
  },
  frameSize:{
    width: 1800,
    height: 400,
  },
  path: "",
  menuKey:"",
  menuItemKey:"",
  status: "idle",
  error: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateWindowSize(state, action) {
      const { width, height } = action.payload;
      state.params.window.size = { width: width, height: height };
    },
    updateleftMenuCollapsed(state, action) {
      state.params.window.leftMenuCollapsed = action.payload;
    },
    toggleLeftMenuOpen(state, action) {
      state.params.window.leftMenuOpen = !state.params.window.leftMenuOpen;
    },
    setLeftMenuOpen(state, action) {
      state.params.window.leftMenuOpen =  action.payload;
    },
    toggleControlBarOpen(state, action) {
      state.params.window.controlBarOpen = !state.params.window.controlBarOpen;
    },
    setControlBarOpen(state, action) {
      state.params.window.controlBarOpen =  action.payload;
    },
    updatePath(state, action) {
      state.path = action.payload;
    },
    updateMenuKey(state, action) {
      state.menuKey = action.payload;
    },
    updateMenuItemKey(state, action) {
      state.menuItemKey = action.payload;
    },
    updateFrameSize(state, action) {
      const { width, height } = action.payload;
      state.frameSize = { width: width, height: height };
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
  extraReducers: {},
});

export const {
  updateWindowSize,
  updateleftMenuCollapsed,
  toggleLeftMenuOpen,
  setLeftMenuOpen,
  toggleControlBarOpen,
  setControlBarOpen,
  updateMenuKey,
  updateMenuItemKey,
  updatePath,
  updateFrameSize,
} = appSlice.actions;
export default appSlice.reducer;

export const getParams = (state) => state.app.params;
export const getLeftMenuOpen = (state) => state.app.params.window.leftMenuOpen;
export const getControlBarOpen = (state) => state.app.params.window.controlBarOpen;

export const getPath = (state) => state.app.path;
export const getMenuKey = (state) => state.app.menuKey;
export const getMenuItemKey = (state) => state.app.menuItemKey;


export const getFrameSize = (state) => state.app.frameSize;
