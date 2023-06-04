import { IStoreRole } from "../..";
import useToast from "../Toast/useToast";
import { useStoreRoleMutation } from "./role.api";

const useStoreRole = () => {
  const [storeAction, meta] = useStoreRoleMutation();
  const { t } = useToast();

  const storeRole = async (role: IStoreRole) => {
    const response = await storeAction(role);

    const success: boolean = "data" in response;
    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "Role created successfully"
          : "We couldn't create the role",
      },
    ]);

    return response;
  };

  return {
    storeRole,
    meta,
  };
};

export default useStoreRole;
