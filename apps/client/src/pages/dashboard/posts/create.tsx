import React from "react";
import { Button, Input } from "ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { withAuth } from "@/middlewares";
import PageTitle from "@/Components/PageTitle";
import Form from "@/Components/Form";
import FormBody from "@/Components/Form/FormBody";
import FormFooter from "@/Components/Form/FormFooter";
import TipTap from "@/Components/TipTap";
import { IStorePost } from "@/index";
import TagInput from "@/Components/TagsInput";
import { handleResponseError } from "@/helpers";
import useStorePost from "@/features/Post/useStorePost";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.number()).refine((tags) => tags.length, {
    message: "At least one tag is required",
  }),
});

const Create = withAuth(() => {

  const {
    storePost,
    meta: {
      isLoading
    }
  } = useStorePost();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<IStorePost>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: IStorePost) => {
    const response = await storePost(data);
    handleResponseError(setError, response);
  };

  return (
    <>
      <PageTitle
        title="Create Post"
        description="You can create posts just from here."
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <Input
            {...register("title")}
            error={errors.title?.message}
            placeholder="Title..."
          />
          <TagInput
            error={errors.tags?.message}
            onChange={(tags: number[]) => setValue("tags", tags)}
          />
          <TipTap
            error={errors.content?.message}
            onChange={(v: string) => {
              setValue("content", v);
            }}
          />
        </FormBody>
        <FormFooter>
          <Button isLoading={isLoading}>Create Post</Button>
        </FormFooter>
      </Form>
    </>
  );
});

export default Create;
