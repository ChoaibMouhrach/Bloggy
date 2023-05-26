import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "ui";
import { z } from "zod";
import Form from "@/Components/Form";
import FormBody from "@/Components/Form/FormBody";
import FormFooter from "@/Components/Form/FormFooter";
import PageTitle from "@/Components/PageTitle";
import { useStoreRoleMutation } from "@/features/apis/roleApi";
import { handleResponseError } from "@/helpers";
import useToast from "@/hooks/useToast";
import { IStoreRole } from "@/index";
import { withAuth } from "@/middlewares";

const schema = z.object({
  name: z.string().min(1).max(60),
});

const Create = withAuth(() => {
  const { t } = useToast();
  const [storeRole, { isLoading }] = useStoreRoleMutation();
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

    if ("data" in response) {
      t([
        {
          state: "success",
          title: "Role created successfully",
        },
      ]);
    }

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
});

export default Create;
