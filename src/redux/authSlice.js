// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initialize state from localStorage if token exists
const tokenFromStorage = localStorage.getItem("token") || null;
const usernameFromStorage = localStorage.getItem("username") || null;
const idFromStorage = localStorage.getItem("id") || null;
const loginTimeFromStorage = localStorage.getItem("loginTime") || null;


// Define initial state

const initialState = {
  token: tokenFromStorage, // Persisted token
  username: usernameFromStorage, // Persisted username
  id: idFromStorage,
  isAuthenticated: !!tokenFromStorage, // Check if authenticated
  loginTime: loginTimeFromStorage, // Persisted login time
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set token and user on login/register
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.username =user.username;
      state.id= user.id;
      state.isAuthenticated = true;

      const loginTime = new Date().getTime();
      state.loginTime = loginTime;

      // Save token to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("id", user.id);
      localStorage.setItem("loginTime", loginTime);

      
    },
    // Clear credentials on logout
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.id = null;
      state.isAuthenticated = false;
      state.loginTime = null;
      // Remove token from localStorage
      localStorage.clear();
      //clear cookies
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
  },
});

// Export actions and reducer
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;