// src/store/placeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: 'map', // 'map' | 'list'
};

const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = placeSlice.actions;
export default placeSlice.reducer;

