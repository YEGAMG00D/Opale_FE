// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,     // 로그인 여부
  user: null,            // 사용자 정보 (id, email, nickname 등)
  token: null,           // AccessToken 저장
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 로그인 성공 시 호출
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // 로그아웃 시 호출
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },

    // 사용자 정보 업데이트 (예: 프로필 수정)
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
