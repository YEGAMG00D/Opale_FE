// src/store/placeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: 'map', // 'map' | 'list'
  gpsLocation: null, // GPS로 얻은 실제 사용자 위치 { latitude, longitude }
  searchCenter: null, // 검색 기준 좌표 { latitude, longitude }
  searchRadius: 5000, // 검색 반경 (미터) - 기본값 5km
  maxSearchRadius: null, // 최대 검색 반경 (미터) - 현재 줌 레벨 기반
  nearbyPlaces: [], // 근처 공연장 목록 (전역 상태)
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
    setMaxSearchRadius: (state, action) => {
      state.maxSearchRadius = action.payload;
    },
    setNearbyPlaces: (state, action) => {
      state.nearbyPlaces = action.payload;
    },
    clearNearbyPlaces: (state) => {
      state.nearbyPlaces = [];
    },
    clearSearchCenter: (state) => {
      state.searchCenter = null;
      state.maxSearchRadius = null; // 검색 기준 좌표 초기화 시 최대 반경도 초기화
      state.nearbyPlaces = []; // 검색 기준 좌표 초기화 시 근처 공연장 목록도 초기화
    },
  },
});

export const { 
  setActiveTab, 
  setGpsLocation, 
  setSearchCenter, 
  setSearchRadius,
  setMaxSearchRadius,
  setNearbyPlaces,
  clearNearbyPlaces,
  clearSearchCenter 
} = placeSlice.actions;
export default placeSlice.reducer;

