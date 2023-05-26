import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "ui";
import { z } from "zod";
import Form from "@/Components/Form";
import FormBody from "@/Components/Form/FormBody";
import FormFooter from "@/Components/Form/FormFooter";
import PageTitle from "@/Components/PageTitle";
import { useUpdateTagMutation } from "@/features/apis/tagApi";
import { handleResponseError } from "@/helpers";
import useToast from "@/hooks/useToast";
import { IStoreTag } from "@/index";
import { withAuth } from "@/middlewares";
import { useRouter } from "next/router";

const schema = z.object({
  name: z.string().min(1).max(60),
});

const Edit = withAuth(() => {
  const router = useRouter();
  const { t } = useToast();
  const [updateTag, { isLoading }] = useUpdateTagMutation();

  const id = Number(router.query.id);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IStoreTag>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IStoreTag) => {
    const response = await updateTag({ id, data });

    if ("data" in response) {
      t([
        {
          state: "success",
          title: "Tag updated successfully",
        },
      ]);
    }

    handleResponseError(setError, response);
  };

  return (
    <>
      <PageTitle
        title="Edit Tag"
        description="You can edit your tags from here"
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <Input
            error={errors.name?.message}
            {...register("name")}
            placeholder="Tag Name..."
          />
        </FormBody>
        <FormFooter>
          <Button isLoading={isLoading}>Update tag</Button>
        </FormFooter>
      </Form>
    </>
  );
});

export default Edit;
