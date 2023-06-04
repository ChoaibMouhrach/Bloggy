import useToast from "../Toast/useToast";
import { useDeleteTagMutation } from "./tag.api";

const useDestroyTag = () => {
  const [deleteAction, meta] = useDeleteTagMutation();
  const { t } = useToast();

  const destroyTag = async (id: number) => {
    const response = await deleteAction(id);

    const success: boolean = "data" in response;

    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "Tag deleted successfully"
          : "We couldn't delete the tag",
      },
    ]);

    return response;
  };

  return {
    destroyTag,
    meta,
  };
};

export default useDestroyTag;
