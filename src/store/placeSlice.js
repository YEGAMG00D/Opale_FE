// src/store/placeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: 'map', // 'map' | 'list'
  gpsLocation: null, // GPS로 얻은 실제 사용자 위치 { latitude, longitude }
  searchCenter: null, // 검색 기준 좌표 { latitude, longitude }
  searchRadius: 5000, // 검색 반경 (미터)
};

const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setGpsLocation: (state, action) => {
      state.gpsLocation = action.payload;
    },
    setSearchCenter: (state, action) => {
      state.searchCenter = action.payload;
    },
    setSearchRadius: (state, action) => {
      state.searchRadius = action.payload;
    },
    clearSearchCenter: (state) => {
      state.searchCenter = null;
    },
  },
});

export const { 
  setActiveTab, 
  setGpsLocation, 
  setSearchCenter, 
  setSearchRadius,
  clearSearchCenter 
} = placeSlice.actions;
export default placeSlice.reducer;

