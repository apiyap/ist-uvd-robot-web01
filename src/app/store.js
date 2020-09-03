import { configureStore } from '@reduxjs/toolkit';

import  appReducer from '../features/appSlice';
import  authReducer from '../features/Auth/AuthSlice';
import  rosReducer from '../features/Ros/rosSlice';
import joyReducer from '../features/joystickSlice';
import webcamReducer from '../features/webcamSlice';

import {reducer as toastrReducer} from 'react-redux-toastr';

//import headerReducer from '../features/admin-lte3/HeaderSlice'
//import adminLteReducer from '../AdminLTE/features/AdminLteSlide'

export default configureStore({
  reducer: {
    app: appReducer,
    toastr: toastrReducer,
    auth: authReducer,
    ros: rosReducer,
    joy: joyReducer,
    webcam: webcamReducer,
  },
})
