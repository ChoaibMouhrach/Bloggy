import { ILoginUser, IStoreUser, IUser } from "@/index";
import api from "./api";

interface IUserResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/logout",
        headers: {
          "authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
    }),
    getProfile: build.query<IUser, void>({
      query: () => ({
        url: "/me",
        headers: {
          "authorization": (() => `Bearer ${localStorage.getItem("accessToken")}`)()
        }
      })
    }),
    login: build.mutation<IUserResponse, ILoginUser>({
      query: (data: ILoginUser) => {
        return {
          url: "/login",
          method: "POST",
          body: data
        }
      }
    }),
    register: build.mutation<IUserResponse, IStoreUser>({
      query: (user: IStoreUser) => ({
        url: "/register",
        method: "POST",
        body: user
      })
    })
  })
})

export const {
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation
} = authApi
