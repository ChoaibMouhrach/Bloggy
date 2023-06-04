import useToast from "../Toast/useToast";
import { useDeletePostMutation } from "./post.api";

const useDestroyPost = () => {
  const [deleteAction, meta] = useDeletePostMutation();
  const { t } = useToast();

  const destroyPost = async (id: number) => {
    const response = await deleteAction(id);

    const success: boolean = "data" in response;
    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "Post deleted successfully"
          : "We couldn't delete the post",
      },
    ]);

    return response;
  };

  return {
    destroyPost,
    meta,
  };
};

export default useDestroyPost;
