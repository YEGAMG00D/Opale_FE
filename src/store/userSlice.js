// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ 로그인 성공
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // ✅ 로그아웃
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },

    // ✅ 사용자 정보 업데이트
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    // ✅ AccessToken 재발급 후 갱신
    reissueToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateUser, reissueToken } =
  userSlice.actions;
export default userSlice.reducer;
