import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "ui";
import { z } from "zod";
import Form from "@/Components/Form";
import FormBody from "@/Components/Form/FormBody";
import FormFooter from "@/Components/Form/FormFooter";
import PageTitle from "@/Components/PageTitle";
import { handleResponseError } from "@/helpers";
import { IStoreTag } from "@/index";
import { withAuth } from "@/middlewares";
import useStoreTag from "@/features/Tag/useStoreTag";
import { ROLES } from "@/config/constants";

const schema = z.object({
  name: z.string().min(1).max(60),
});

const Create = withAuth(() => {
  const {
    storeTag,
    meta: { isLoading },
  } = useStoreTag();

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
    const response = await storeTag(data);
    handleResponseError(setError, response);
  };

  return (
    <>
      <PageTitle
        title="Create Tag"
        description="You can create your tags from here"
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
          <Button isLoading={isLoading}>Create tag</Button>
        </FormFooter>
      </Form>
    </>
  );
}, [ROLES.ADMIN]);

export default Create;
