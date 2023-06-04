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
import { IStoreRole } from "@/index";
import { withAuth } from "@/middlewares";
import useStoreRole from "@/features/Role/useStoreRole";
import { ROLES } from "@/config/constants";

const schema = z.object({
  name: z.string().min(1).max(60),
});

const Create = withAuth(() => {
  const {
    storeRole,
    meta: { isLoading },
  } = useStoreRole();

  // form
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IStoreRole>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IStoreRole) => {
    const response = await storeRole(data);

    handleResponseError(setError, response);
  };

  return (
    <>
      <PageTitle
        title="Create Role"
        description="You can create your role just from here."
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
          <Button isLoading={isLoading}>Create Role</Button>
        </FormFooter>
      </Form>
    </>
  );
}, [ROLES.ADMIN]);

export default Create;
