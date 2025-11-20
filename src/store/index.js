// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import placeReducer from "./placeSlice";
import performanceReducer from "./performanceSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    place: placeReducer,
    performance: performanceReducer,
  },
});

export default store;
