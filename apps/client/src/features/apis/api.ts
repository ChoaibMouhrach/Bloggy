import { IResponseError } from "@/index";
import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL,
});

const baseQueryWithAuth = async (
  args: FetchArgs | string,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let response = await baseQuery(args, api, extraOptions);

  if (response.error) {
    const error = response.error.data as IResponseError<{}>;

    if (error.message === "jwt expired") {
      // refresh
      const refreshResponse = await baseQuery(
        {
          url: "/refresh",
          method: "POST",
          headers: {
            authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        },
        api,
        extraOptions
      );

      // refreshing ok
      if (refreshResponse.data) {
        if (typeof args === "string") {
          args = {
            url: args,
          };
        }

        const data = refreshResponse.data as {
          accessToken: string;
          refreshToken: string;
        };

        response = await baseQuery(
          {
            ...args,
            headers: {
              authorization: `Bearer ${data.accessToken}`,
            },
          },
          api,
          extraOptions
        );

        // set the tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        return response;
      }

      // remove tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

    }

  }

  return response;
};

const api = createApi({
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});

export default api;
