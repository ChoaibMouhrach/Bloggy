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
import { IStoreRole, IUpdateRole } from "@/index";
import { withAuth } from "@/middlewares";
import useUpdateRole from "@/features/Role/useUpdateRole";

const schema = z.object({
  name: z.string().min(1).max(60),
});

const Edit = withAuth(() => {
  const router = useRouter();
  const {
    updateRole,
    meta: {
      isLoading
    }
  } = useUpdateRole();

  const id = Number(router.query.id);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateRole>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IUpdateRole) => {
    const response = await updateRole({ id, data });
    handleResponseError(setError, response);
  };

  return (
    <>
      <PageTitle
        title="Edit Role"
        description="You can update your role just from here."
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <Input
            error={errors.name?.message}
            {...register("name")}
            placeholder="Role Name"
          />
        </FormBody>
        <FormFooter>
          <Button isLoading={isLoading}>Update Role</Button>
        </FormFooter>
      </Form>
    </>
  );
});

export default Edit;
