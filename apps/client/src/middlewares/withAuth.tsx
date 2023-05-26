import { useRouter } from "next/router";
import React, { ComponentType, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "ui";
import { getUser, setUser } from "@/features/slices/userSlice";
import { useGetProfileQuery } from "@/features/apis/authApi";
import { DashboardLayout } from "@/Components/Layouts/Dashboard";

export const withAuth = (CB: ComponentType) => {
  function Component() {
    const router = useRouter();
    const userState = useSelector(getUser);
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
    }, [isSuccess]);

    if (isError) {
      router.push("/sign-in");
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
