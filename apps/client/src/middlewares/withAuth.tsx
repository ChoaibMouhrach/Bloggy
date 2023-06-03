import { useRouter } from "next/router";
import React, { ComponentType, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Loading } from "ui";
import { setUser } from "@/features/User/user.slice";
import { useGetProfileQuery } from "@/features/Auth/auth.api";
import { DashboardLayout } from "@/Components/Layouts/Dashboard";
import useGetUser from "@/features/User/useGetUser";
import PermissionRequired from "@/Components/PermissionRequired";

export const withAuth = (CB: ComponentType, ids?: number[]) => {
  function Component() {
    const router = useRouter();
    const userState = useGetUser();
    const dispatch = useDispatch();

    const { data: user, isError, isSuccess } = useGetProfileQuery();

    useEffect(() => {
      if (isSuccess) {
        dispatch(
          setUser({
            user,
            accessToken: localStorage.getItem("accessToken")!,
            refreshToken: localStorage.getItem("refreshToken")!,
          })
        );
      }

    }, [isSuccess, isError, userState]);

    if (isError) {
      router.push("/sign-in");
    }

    if (isSuccess && userState && ids && !ids.includes(userState.roleId)) {
      return <PermissionRequired />
    }

    if (isSuccess && userState) {
      return (
        <DashboardLayout>
          <CB />
        </DashboardLayout>
      );
    }

    return <Loading />;
  }

  return Component;
};

export default withAuth;
