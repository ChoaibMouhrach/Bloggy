import { AiOutlineLoading3Quarters } from "react-icons/ai";
import React from "react";
import { Button, Input } from "ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import { withAuth } from "@/middlewares";
import PageTitle from "@/Components/PageTitle";
import Form from "@/Components/Form";
import FormBody from "@/Components/Form/FormBody";
import FormFooter from "@/Components/Form/FormFooter";
import TipTap from "@/Components/TipTap";
import { IUpdatePost } from "@/index";
import TagInput from "@/Components/TagsInput";
import {
  useGetPostQuery,
  useUpdatePostMutation,
} from "@/features/apis/postApit";
import { handleResponseError } from "@/helpers";
import useToast from "@/hooks/useToast";

const schema = z
  .object({
    title: z.preprocess((title) => {
      return title === "" ? undefined : title;
    }, z.string().min(1).optional()),
    content: z.preprocess((content) => {
      return content === "" ? undefined : content;
    }, z.string().min(1).optional()),
    tags: z.array(z.number()).optional(),
  })
  .refine((data) => Object.keys(data).length, {
    message: "Chnage Something first",
    path: ["root"],
  });

const Edit = withAuth(() => {
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const { t } = useToast();

  const router = useRouter();

  const id = Number(router.query.id);

  const {
    data: post,
    isLoading: isPostLoading,
    isSuccess: isPostSuccess,
  } = useGetPostQuery(id);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<IUpdatePost>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: IUpdatePost) => {
    // eslint-disable-next-line no-param-reassign
    if (data.title === post?.title) delete data.title;
    // eslint-disable-next-line no-param-reassign
    if (data.content === post?.content) delete data.content;

    if (!Object.keys(data).length) {
      setError("title", {
        message: "Change something first",
      });
      return;
    }

    const response = await updatePost({ id, data });

    if ("data" in response) {
      t([
        {
          state: "success",
          title: "Post addedd successfully",
        },
      ]);
      return;
    }

    handleResponseError(setError, response);
  };

  return (
    <>
      <PageTitle
        title="Edit Post"
        description="You can edit posts just from here."
      />
      {isPostSuccess && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormBody>
            <Input
              {...register("title")}
              error={errors.title?.message}
              placeholder="Title..."
              defaultValue={post.title}
            />
            <TagInput
              error={errors.tags?.message}
              onChange={(tags: number[]) => setValue("tags", tags)}
              defaultValue={post.tags}
            />
            <TipTap
              error={errors.content?.message}
              defaultValue={post.content}
              onChange={(v: string) => {
                setValue("content", v);
              }}
            />
          </FormBody>
          <FormFooter>
            <Button isLoading={isLoading}>Update Post</Button>
          </FormFooter>
        </Form>
      )}
      {isPostLoading && (
        <AiOutlineLoading3Quarters className="text-xl animate-spin" />
      )}
    </>
  );
});

export default Edit;
