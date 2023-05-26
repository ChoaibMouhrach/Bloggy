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
import {
  useStoreRoleMutation,
  useUpdateRoleMutation,
} from "@/features/apis/roleApi";
import { handleResponseError } from "@/helpers";
import useToast from "@/hooks/useToast";
import { IStoreRole } from "@/index";
import { withAuth } from "@/middlewares";

const schema = z.object({
  name: z.string().min(1).max(60),
});

const Edit = withAuth(() => {
  const router = useRouter();
  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  const { t } = useToast();

  const id = Number(router.query.id);

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
    const response = await updateRole({ id, data });

    if ("data" in response) {
      t([
        {
          state: "success",
          title: "Role updated successfully",
        },
      ]);
    }

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
