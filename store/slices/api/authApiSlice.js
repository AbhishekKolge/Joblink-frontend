import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userDetails) => ({
        url: "/auth/register",
        method: "POST",
        body: userDetails,
      }),
    }),
    login: builder.mutation({
      query: (userDetails) => ({
        url: "/auth/login",
        method: "POST",
        body: userDetails,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE",
      }),
    }),
    verifyEmail: builder.mutation({
      query: (verificationDetails) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: verificationDetails,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (userDetails) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: userDetails,
      }),
    }),
    resetPassword: builder.mutation({
      query: (passwordDetails) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: passwordDetails,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApiSlice;
