import { IUpdateTag } from "@/index";
import { useUpdateTagMutation } from "./tag.api";
import useToast from "../Toast/useToast";

const useUpdateTag = () => {
  const [updateAction, meta] = useUpdateTagMutation();
  const { t } = useToast();

  const updateTag = async (data: { id: number; data: IUpdateTag }) => {
    const response = await updateAction(data);

    const success: boolean = "data" in response;
    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "Tag Updated successfully"
          : "We couldn't update the tag",
      },
    ]);

    return response;
  };

  return {
    updateTag,
    meta,
  };
};

export default useUpdateTag;
