import { Path } from "react-hook-form";

// errors related
export type ErrorTypes =
  | "Bad Request"
  | "Unauthorized"
  | "Not Found"
  | "Internal Server Error";
type ResponseErrorMessage<TPath> =
  | string
  | {
      path: [Path<T>];
      message: string;
    }[];
export interface IResponseError<TPath> {
  statusCode: number;
  message: ResponseErrorMessage<TPath>;
  error: ErrorTypes;
}

export interface IUpdateUser {
  username?: string;
  url?: string;
  bio?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  roleId?: number;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  token: string;
  data: {
    password: string;
    password_confirmation: string;
  };
}

export interface ISignUpUser {
  username: string;
  url?: string;
  bio?: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ISignInUser {
  email: string;
  password: string;
}

export interface ITimeStamps {
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IRole extends ITimeStamps {
  id: string;
  name: string;
}

export interface IUser extends ITimeStamps {
  id: string;
  username: string;
  url: string | null;
  bio: string | null;
  email: string;
  roleId: number;
  verfiedAt: string | null;
  Role?: Role;
}

export interface IPost extends ITimeStamps {
  id: number;
  title: string;
  content: string;
  isDraft: boolean;
  tags: ITag[];
}

export interface IPaginate<T> {
  data: T[];
  count: number;
  limit: number;
  skip: number;
}

export interface ITag extends ITimeStamps {
  id: number;
  name: string;
}

export interface IRole extends ITimeStamps {
  id: number;
  name: string;
}

export interface IStoreRole {
  name: string;
}

export interface IStoreTag {
  name: string;
}

export interface IStoreUser {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  roleId: number;
  bio?: string;
  url?: string;
}

export interface IStorePost {
  title: string;
  tags: number[];
  content: string;
}

export interface IUpdatePost {
  title?: string;
  tags?: number[];
  content?: string;
}

export interface IUpdateRole {
  name: string;
}

export interface IUpdateTag {
  name: string;
}
