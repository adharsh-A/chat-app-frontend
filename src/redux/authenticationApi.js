import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const authenticationApi = createApi({
  reducerPath: "authenticationApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authenticationApi;