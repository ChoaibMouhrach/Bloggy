import { IPaginate, IStoreTag, ITag, IUpdateTag } from "@/index";
import api from "./api";

const tagApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTags: build.query<IPaginate<ITag>, { page?: number; search?: string }>({
      query: ({ page, search }) => {
        const params = [];

        if (page) params.push(`page=${page}`);
        if (search) params.push(`search=${search}`);

        return {
          url: `/tags?${params.join("&")}`,
        };
      },
    }),
    storeTag: build.mutation<ITag, IStoreTag>({
      query: (data) => ({
        url: `/tags`,
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
    updateTag: build.mutation<ITag, { id: number; data: IUpdateTag }>({
      query: ({ id, data }) => ({
        url: `/tags/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
    deleteTag: build.mutation<void, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
  }),
});

export const {
  useGetTagsQuery,
  useUpdateTagMutation,
  useStoreTagMutation,
  useDeleteTagMutation,
} = tagApi;
