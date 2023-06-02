import { IUpdateRole } from "@/index";
import useToast from "../Toast/useToast";
import { useUpdateRoleMutation } from "./role.api";

const useUpdateRole = () => {

  const [updateAction, meta] = useUpdateRoleMutation();
  const {
    t
  } = useToast()


  const updateRole = async (data: { id: number, data: IUpdateRole }) => {

    const response = await updateAction(data);

    const success: boolean = "data" in response;

    t([{
      state: success ? "success" : "danger",
      title: success ? "Role Updated successfully" : "We couldn't update the role"
    }])

    return response
  }

  return {
    updateRole,
    meta
  }

}

export default useUpdateRole;
