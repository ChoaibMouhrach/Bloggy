import { IStoreUser } from "@/index";
import { useStoreUserMutation } from "./user.api"
import useToast from "../Toast/useToast";

const useStoreUser = () => {

  const [storeAction, meta] = useStoreUserMutation();
  const { t } = useToast()

  const storeUser = async (data: IStoreUser) => {
    const response = await storeAction(data);

    const success: boolean = "data" in response;
    t([{
      state: success ? "success" : "danger",
      title: success ? "User created succesfully" : "We couldn't create the user"
    }])

    return response
  }

  return {
    storeUser,
    meta
  }
}

export default useStoreUser
