import { useUpdatePostMutation } from "./post.api";
import useToast from "../Toast/useToast";
import { IUpdatePost } from "@/index";

const useUpdatePost = () => {
  const [updateAction, meta] = useUpdatePostMutation();
  const { t } = useToast();

  const updatePost = async (data: { id: number; data: IUpdatePost }) => {
    const response = await updateAction(data);

    const success = "data" in response;
    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "Post updated successfully"
          : "We couldn't update the post",
      },
    ]);

    return response;
  };

  return {
    updatePost,
    meta,
  };
};

export default useUpdatePost;
