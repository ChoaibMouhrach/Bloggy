import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "ui";
import { z } from "zod";
import { useRouter } from "next/router";
import Form from "@/Components/Form";
import FormBody from "@/Components/Form/FormBody";
import FormFooter from "@/Components/Form/FormFooter";
import PageTitle from "@/Components/PageTitle";
import { handleResponseError } from "@/helpers";
import { IUpdateTag } from "@/index";
import { withAuth } from "@/middlewares";
import useUpdateTag from "@/features/Tag/useUpdateTag";
import { ROLES } from "@/config/constants";

const schema = z.object({
  name: z.string().min(1).max(60),
});

const Edit = withAuth(() => {
  const router = useRouter();
  const {
    updateTag,
    meta: { isLoading },
  } = useUpdateTag();

  const id = Number(router.query.id);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateTag>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IUpdateTag) => {
    const response = await updateTag({ id, data });

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
}, [ROLES.ADMIN]);

export default Edit;
