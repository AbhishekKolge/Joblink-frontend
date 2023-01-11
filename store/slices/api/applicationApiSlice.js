import { apiSlice } from "./apiSlice";

export const applicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createApplication: builder.mutation({
      query: (jobDetails) => ({
        url: "/application",
        method: "POST",
        body: jobDetails,
      }),
    }),
    getUserApplications: builder.mutation({
      query: (queries) => {
        let queryString = "";
        for (const key in queries) {
          if (queries[key]) {
            queryString = `${queryString}${queryString ? "&" : "?"}${key}=${
              queries[key]
            }`;
          }
        }

        return { url: `/application${queryString}`, method: "GET" };
      },
    }),
    getJobApplications: builder.mutation({
      query: ({ queries, jobId }) => {
        let queryString = "";
        for (const key in queries) {
          if (queries[key]) {
            queryString = `${queryString}${queryString ? "&" : "?"}${key}=${
              queries[key]
            }`;
          }
        }

        return { url: `/application/${jobId}${queryString}`, method: "GET" };
      },
    }),
    updateApplication: builder.mutation({
      query: ({ applicationId, status }) => ({
        url: `/application/${applicationId}`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useCreateApplicationMutation,
  useGetUserApplicationsMutation,
  useGetJobApplicationsMutation,
  useUpdateApplicationMutation,
} = applicationApiSlice;
