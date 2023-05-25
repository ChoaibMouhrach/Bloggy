import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Button, Input, Select, TextArea } from "ui";
import { z } from "zod";
import Form from "@/Components/Form";
import FormBody from "@/Components/Form/FormBody";
import FormFooter from "@/Components/Form/FormFooter";
import PageTitle from "@/Components/PageTitle";
import { useGetRolesQuery } from "@/features/apis/roleApi";
import { useStoreUserMutation } from "@/features/apis/userApi";
import { handleResponseError } from "@/helpers";
import useToast from "@/hooks/useToast";
import { IStoreUser } from "@/index";
import { withAuth } from "@/middlewares";

const schema = z.object({
  username: z.string().min(1).max(60),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
  roleId: z.number().gt(0),
  url: z
    .string()
    .optional()
    .pipe(
      z.string().refine(
        (url) => {
          if (url && !z.string().url().safeParse(url).success) {
            return false;
          }
          return true;
        },
        { message: "Url invalid" }
      )
    ),
  bio: z.string().max(255).optional(),
});

const Create = withAuth(() => {
  const router = useRouter();
  const { data: roles, isLoading: isRolesLoading } = useGetRolesQuery({});

  const { t } = useToast();
  const [storeUser, { isLoading }] = useStoreUserMutation();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IStoreUser>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IStoreUser) => {
    const response = await storeUser(data);
    if ("data" in response) {
      t([
        {
          state: "success",
          title: "User created successfully",
        },
      ]);
      router.push("/dashboard/users");
    }
    handleResponseError(setError, response);
  };

  return (
    <>
      <PageTitle
        title="Create User"
        description="You can create your users from here"
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <Input
            error={errors.username?.message}
            {...register("username")}
            placeholder="Username..."
          />
          <Select
            onValueChange={(v: string) => setValue("roleId", Number(v))}
            error={errors.roleId?.message}
            isLoading={isRolesLoading}
            placeholder="Select role"
            options={
              roles?.data.map((role) => ({
                value: String(role.id),
                name: role.name,
              })) ?? []
            }
          />
          <Input
            error={errors.email?.message}
            {...register("email")}
            placeholder="Email Address..."
          />
          <Input
            error={errors.password?.message}
            {...register("password")}
            placeholder="Password..."
          />
          <Input
            error={errors.password_confirmation?.message}
            {...register("password_confirmation")}
            placeholder="Password Confirmation..."
          />
          <Input
            error={errors.url?.message}
            {...register("url")}
            placeholder="Url..."
          />
          <TextArea
            error={errors.bio?.message}
            {...register("bio")}
            placeholder="Bio..."
          />
        </FormBody>
        <FormFooter>
          <Button isLoading={isLoading}>Create user</Button>
        </FormFooter>
      </Form>
    </>
  );
});

export default Create;
