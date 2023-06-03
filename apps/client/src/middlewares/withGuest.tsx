import React, { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loading } from "ui";

export const withGuest = (CB: ComponentType) => {
  function Component() {
    const [state, setState] = useState<"loading" | "success" | "failed">(
      "loading"
    );
    const router = useRouter();

    useEffect(() => {
      if (localStorage.getItem("accessToken")) {
        setState("success");
      } else {
        setState("failed");
      }
    }, []);

    if (state === "success") {
      router.push("/dashboard/profile");
    }

    if (state === "failed") {
      return <CB />;
    }

    return <Loading />;
  }

  return Component;
};
