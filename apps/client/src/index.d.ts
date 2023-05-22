import { Path } from "react-hook-form";

export type ErrorTypes = "Bad Request" | "Unauthorized" | "Not Found" | "Internal Server Error";

type ResponseErrorMessage<TPath> = string | {
  path: [Path<T>];
  message: string
}[];

export interface IResponseError<TPath> {
  statusCode: number;
  message: ResponseErrorMessage<TPath>;
  error: ErrorTypes;
}

export interface IStoreUser {
  username: string;
  url?: string;
  bio?: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ILoginUser {
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
  role?: Role;
}
