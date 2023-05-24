import { IPaginate, IRole, IStoreRole } from "@/index";
import api from "./api";

const roleApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<IPaginate<IRole>, { page?: number, search?: string }>({
      query: ({ page, search }) => {
        const params = [];

        if (page) params.push(`page=${page}`)
        if (search) params.push(`search=${search}`)

        return {
          url: `/roles?${params.join("&")}`,
        };
      },
    }),
    storeRole: build.mutation<IRole, IStoreRole>({
      query: (data) => ({
        url: `/roles`,
        method: "POST",
        body: data,
        headers: {
          "authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      }),
    }),
    deleteRole: build.mutation<void, number>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
        headers: {
          "authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      }),
    }),
  }),
});

export const { useGetRolesQuery, useStoreRoleMutation, useDeleteRoleMutation } = roleApi;
