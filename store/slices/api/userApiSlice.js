import { apiSlice } from "./apiSlice";

export const useApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    showMe: builder.query({
      query: () => ({
        url: "/users/show-me",
      }),
      providesTags: ["User"],
    }),
    upload: builder.mutation({
      query: (fileData) => ({
        url: "/users/profile-image",
        method: "POST",
        body: fileData,
      }),
      invalidatesTags: ["User"],
    }),
    uploadResume: builder.mutation({
      query: (fileData) => ({
        url: "/users/resume",
        method: "POST",
        body: fileData,
      }),
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (userDetails) => ({
        url: "/users",
        method: "PATCH",
        body: userDetails,
      }),
      invalidatesTags: ["User"],
    }),
    removeFile: builder.mutation({
      query: ({ fileId, isResume }) => ({
        url: `/users/file?fileId=${fileId}&isResume=${isResume}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: "/users",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useShowMeQuery,
  useUploadMutation,
  useUploadResumeMutation,
  useUpdateProfileMutation,
  useRemoveFileMutation,
  useDeleteAccountMutation,
} = useApiSlice;
