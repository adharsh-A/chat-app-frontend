import { configureStore } from "@reduxjs/toolkit";
import { authenticationApi } from "./authenticationApi.js";
import { authSlice } from "./authSlice.js";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        auth:authSlice.reducer,
      [authenticationApi.reducerPath]: authenticationApi.reducer,
   
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authenticationApi.middleware,

    ),
});
// to listen redux query on refecthing
// handlinfg refetches
setupListeners(store.dispatch);