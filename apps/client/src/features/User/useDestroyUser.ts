import useToast from "../Toast/useToast";
import { useDeleteUserMutation } from "./user.api";

// use to destroy users
const useDestroyUser = () => {
  const [deleteAction, meta] = useDeleteUserMutation();
  const { t } = useToast();

  const destroyUser = async (id: number) => {
    const response = await deleteAction(id);

    // check if response is okay
    const success: boolean = "data" in response;

    // fire new alert
    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "User successfully deleted"
          : "We couldn't delete the user",
      },
    ]);

    return response;
  };

  return {
    destroyUser,
    meta,
  };
};

export default useDestroyUser;
