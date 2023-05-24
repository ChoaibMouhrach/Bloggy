import { IPaginate, ITag } from "@/index";
import api from "./api";

const tagApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTags: build.query<IPaginate<ITag>, { page?: number, search?: string }>({
      query: ({ page, search }) => {
        const params = [];

        if (page) params.push(`page=${page}`)
        if (search) params.push(`search=${search}`)

        return {
          url: `/tags?${params.join("&")}`,
        };
      },
    }),
    deleteTag: build.mutation<void, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
        headers: {
          "authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      }),
    }),
  }),
});

export const { useGetTagsQuery, useDeleteTagMutation } = tagApi;
