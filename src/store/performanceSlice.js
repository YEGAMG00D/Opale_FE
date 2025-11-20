// src/store/performanceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: 'reservation', // 기본 탭 (공연 상세 페이지용)
  selectedCategory: 'all', // 공연 목록 페이지 카테고리
  showOngoingOnly: false, // 진행중인 공연만 보기
  searchQuery: '', // 검색어 (SearchCulturePage용)
};

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setShowOngoingOnly: (state, action) => {
      state.showOngoingOnly = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setActiveTab, setSelectedCategory, setShowOngoingOnly, setSearchQuery } = performanceSlice.actions;
export default performanceSlice.reducer;

