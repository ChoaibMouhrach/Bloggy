import {
  IForgotPassword,
  ISignInUser,
  IResetPassword,
  ISignUpUser,
  IUpdateUser,
  IUser,
} from "@/index";
import api from "@/store/api";

interface IUserResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    signOut: build.mutation<void, void>({
      query: () => ({
        url: "/sign-out",
        method: "POST",
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
    signIn: build.mutation<IUserResponse, ISignInUser>({
      query: (data) => {
        return {
          url: "/sign-in",
          method: "POST",
          body: data,
        };
      },
    }),
    signUp: build.mutation<IUserResponse, ISignUpUser>({
      query: (user) => ({
        url: "/sign-up",
        method: "POST",
        body: user,
      }),
    }),
    updateProfile: build.mutation<void, IUpdateUser>({
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
  useSignOutMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useSignInMutation,
  useSignUpMutation,
} = authApi;
