import { IUpdateUser } from "@/index";
import { useUpdateUserMutation } from "./user.api";
import useToast from "../Toast/useToast";

const useUpdateUser = () => {
  const [updateAction, meta] = useUpdateUserMutation();
  const { t } = useToast();

  const updateUser = async (data: { id: number; data: IUpdateUser }) => {
    const response = await updateAction(data);

    const success = "data" in response;
    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "User updated successfully"
          : "We couldn't update the user",
      },
    ]);

    return response;
  };

  return {
    updateUser,
    meta,
  };
};

export default useUpdateUser;
