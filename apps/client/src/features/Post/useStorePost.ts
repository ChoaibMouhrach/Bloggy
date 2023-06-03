import { IStorePost } from "@/index";
import { useStorePostMutation } from "./post.api";
import useToast from "../Toast/useToast";

const useStorePost = () => {
  const [storeAction, meta] = useStorePostMutation();
  const { t } = useToast();

  const storePost = async (data: IStorePost) => {
    const response = await storeAction(data);

    const success = "data" in response;
    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "Post created successfully"
          : "We couldn't create the post",
      },
    ]);

    return response;
  };

  return {
    storePost,
    meta,
  };
};

export default useStorePost;
