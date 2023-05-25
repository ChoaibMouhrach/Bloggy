import { IPaginate, IPost } from "@/index";
import api from "./api";

const postApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<IPaginate<IPost>, { page?: number; search?: string }>(
      {
        query: ({ page, search }) => {
          const params = [];

          if (page) params.push(`page=${page}`);
          if (search) params.push(`search=${search}`);

          return {
            url: `/posts?${params.join("&")}`,
          };
        },
      }
    ),
    deletePost: build.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
  }),
});

export const { useGetPostsQuery, useDeletePostMutation } = postApi;
