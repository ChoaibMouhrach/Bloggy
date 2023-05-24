import { IPaginate, IUser } from "@/index";
import api from "./api";

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<IPaginate<IUser>, { page?: number, search?: string }>({
      query: ({ page, search }) => {
        const params = [];

        if (page) params.push(`page=${page}`)
        if (search) params.push(`search=${search}`)

        return {
          url: `/users?${params.join("&")}`,
          headers: {
            "authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        };
      },
    }),
    deleteUser: build.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
        headers: {
          "authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      }),
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation } = userApi;
