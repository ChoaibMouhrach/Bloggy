import useToast from "../Toast/useToast";
import { useDeleteRoleMutation } from "./role.api";

const useDestroyRole = () => {
  const [deleteAction, meta] = useDeleteRoleMutation();
  const { t } = useToast();

  const destroyRole = async (id: number) => {
    const response = await deleteAction(id);

    const success: boolean = "data" in response;
    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "Role deleted successfully"
          : "We couldn't delete the role",
      },
    ]);

    return response;
  };

  return {
    destroyRole,
    meta,
  };
};

export default useDestroyRole;
