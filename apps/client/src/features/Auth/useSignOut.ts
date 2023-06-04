import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSignOutMutation } from "./auth.api";
import useToast from "../Toast/useToast";
import { removeUser } from "../User/user.slice";

const useSignOut = () => {
  const [signOutAction, meta] = useSignOutMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useToast();

  const signOut = async () => {
    const response = await signOutAction();

    if ("data" in response) {
      // remove tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // remove user from store
      dispatch(removeUser());

      // fire an alert
      t([
        {
          state: "success",
          title: "Good Bye",
        },
      ]);

      router.push("/");
    } else {
      // fire an alert
      t([
        {
          state: "danger",
          title: "We couldn't sign you out",
        },
      ]);
    }

    return response;
  };

  return {
    signOut,
    meta,
  };
};

export default useSignOut;
