import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { checkTimeIsExpired } from "../../../helpers/time";

import { logoutHandler } from "../../actions/auth/authActions";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_URL,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken, accessTokenExpirationTime } =
      getState().auth.tokenDetails;
    const tokenExpired = checkTimeIsExpired(accessTokenExpirationTime);

    if (accessToken && !tokenExpired) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logoutHandler());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["SingleJob", "User"],
  endpoints: (builder) => ({}),
});
