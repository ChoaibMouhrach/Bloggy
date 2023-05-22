import {
  IForgotPassword,
  ILoginUser,
  IResetPassword,
  IStoreUser,
  IUpdateUser,
  IUser,
} from "@/index";
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
        url: "/sign-out",
        headers: {
          authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      }),
    }),
    getProfile: build.query<IUser, void>({
      query: () => ({
        url: "/me",
        headers: {
          authorization: (() =>
            `Bearer ${localStorage.getItem("accessToken")}`)(),
        },
      }),
    }),
    login: build.mutation<IUserResponse, ILoginUser>({
      query: (data: ILoginUser) => {
        return {
          url: "/login",
          method: "POST",
          body: data,
        };
      },
    }),
    register: build.mutation<IUserResponse, IStoreUser>({
      query: (user: IStoreUser) => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
    }),
    updateUser: build.mutation<void, IUpdateUser>({
      query: (data) => ({
        url: "/me",
        method: "PATCH",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
      }),
    }),
    forgotPassword: build.mutation<void, IForgotPassword>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: build.mutation<void, IResetPassword>({
      query: ({ token, data }) => ({
        url: `/reset-password/${token}`,
        method: "POST",
        body: data,
      }),
    }),
    sendConfirmationEmail: build.mutation<void, void>({
      query: () => ({
        url: `/send-confirmation-email`,
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
    confirmEmailAddress: build.mutation<void, string>({
      query: (token: string) => ({
        url: `/confirm-email/${token}`,
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      }),
    }),
  }),
});

export const {
  useConfirmEmailAddressMutation,
  useSendConfirmationEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
} = authApi;
