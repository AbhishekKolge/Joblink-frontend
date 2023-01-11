import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  tokenDetails: {
    accessToken: "",
    refreshToken: "",
    accessTokenExpirationTime: "",
    refreshTokenExpirationTime: "",
  },
  role: "",
  isLoggedIn: null,
  userId: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      const {
        accessToken,
        refreshToken,
        accessTokenExpirationTime,
        refreshTokenExpirationTime,
        role,
        userId,
      } = action.payload;

      state.tokenDetails = {
        accessToken,
        refreshToken,
        accessTokenExpirationTime,
        refreshTokenExpirationTime,
      };
      state.role = role;
      state.userId = userId;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.tokenDetails = {
        accessToken: "",
        refreshToken: "",
        accessTokenExpirationTime: "",
        refreshTokenExpirationTime: "",
      };
      state.role = "";
      state.userId = "";
      state.isLoggedIn = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
