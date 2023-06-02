import { IStoreTag } from "../..";
import useToast from "../Toast/useToast";
import { useStoreTagMutation } from "./tag.api";

const useStoreTag = () => {
  const [storeAction, meta] = useStoreTagMutation();
  const { t } = useToast();

  const storeTag = async (data: IStoreTag) => {
    const response = await storeAction(data);

    const success: boolean = "data" in response;

    t([
      {
        state: success ? "success" : "danger",
        title: success
          ? "Tag created successfully"
          : "We couldn't create the tag",
      },
    ]);

    return response;
  };

  return {
    storeTag,
    meta,
  };
};

export default useStoreTag;
