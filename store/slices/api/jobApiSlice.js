import { apiSlice } from "./apiSlice";

export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (jobDetails) => ({
        url: "/jobs",
        method: "POST",
        body: jobDetails,
      }),
    }),
    getAllJobCategories: builder.query({
      query: () => ({
        url: "/job-categories",
      }),
    }),
    getAllJobs: builder.mutation({
      query: (queries) => {
        let queryString = "";
        for (const key in queries) {
          if (queries[key]) {
            queryString = `${queryString}${queryString ? "&" : "?"}${key}=${
              queries[key]
            }`;
          }
        }

        return { url: `/jobs${queryString}`, method: "GET" };
      },
    }),
    getMyJobs: builder.mutation({
      query: (queries) => {
        let queryString = "";
        for (const key in queries) {
          if (queries[key]) {
            queryString = `${queryString}${queryString ? "&" : "?"}${key}=${
              queries[key]
            }`;
          }
        }

        return { url: `/jobs/my${queryString}`, method: "GET" };
      },
    }),
    deleteJob: builder.mutation({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: "DELETE",
      }),
    }),
    getMyJob: builder.query({
      query: (jobId) => ({
        url: `/jobs/my/${jobId}`,
      }),
      providesTags: ["SingleJob"],
    }),
    updateJob: builder.mutation({
      query: ({ jobDetails, jobId }) => ({
        url: `/jobs/${jobId}`,
        method: "PATCH",
        body: jobDetails,
      }),
      invalidatesTags: ["SingleJob"],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useGetAllJobCategoriesQuery,
  useGetAllJobsMutation,
  useGetMyJobsMutation,
  useDeleteJobMutation,
  useGetMyJobQuery,
  useUpdateJobMutation,
} = jobApiSlice;
