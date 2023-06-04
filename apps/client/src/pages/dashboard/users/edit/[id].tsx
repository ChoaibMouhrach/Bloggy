/* eslint-disable no-param-reassign */
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
import { useGetRolesQuery } from "@/features/Role/role.api";
import { handleResponseError } from "@/helpers";
import { IUpdateUser } from "@/index";
import { withAuth } from "@/middlewares";
import { useGetUserQuery } from "@/features/User/user.api";
import useUpdateUser from "@/features/User/useUpdateUser";
import { ROLES } from "@/config/constants";

const schema = z
  .object({
    username: z.preprocess((username) => {
      return username === "" ? undefined : username;
    }, z.string().min(1).optional()),
    email: z.preprocess((email) => {
      return email === "" ? undefined : email;
    }, z.string().email().optional()),
    url: z.preprocess((url) => {
      return url === "" ? undefined : url;
    }, z.string().url().optional()),
    bio: z.preprocess((bio) => {
      return bio === "" ? undefined : bio;
    }, z.string().min(1).optional()),
    password: z.preprocess((password) => {
      return password === "" ? undefined : password;
    }, z.string().min(8).optional()),
    password_confirmation: z.preprocess((password_confirmation) => {
      return password_confirmation === "" ? undefined : password_confirmation;
    }, z.string().min(8).optional()),
    roleId: z.preprocess((roleId) => {
      return roleId === "" ? undefined : roleId;
    }, z.number().optional()),
  })
  .refine(
    ({ password, password_confirmation }) => {
      if (password || password_confirmation) {
        return password_confirmation === password;
      }
      return true;
    },
    {
      path: ["password_confirmation"],
      message: "Password and Password confirmation does not match",
    }
  )
  .refine(
    (data) => {
      return Boolean(
        Object.entries(data).filter(([, value]) => value !== undefined).length
      );
    },
    {
      message: "Change something first",
      path: ["username"],
    }
  );

const Edit = withAuth(() => {
  const router = useRouter();
  const id = Number(router.query.id);

  const { data: user, isLoading: isUserLoading } = useGetUserQuery(id);
  const { data: roles, isLoading: isRolesLoading } = useGetRolesQuery({});

  const {
    updateUser,
    meta: { isLoading },
  } = useUpdateUser();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IUpdateUser>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IUpdateUser) => {
    if (data.username === user?.username) delete data.username;
    if (data.email === user?.email) delete data.email;
    if (data.roleId === user?.roleId) delete data.roleId;
    if (data.url === user?.url) delete data.url;
    if (data.bio === user?.bio) delete data.bio;

    const response = await updateUser({ id, data });

    handleResponseError(setError, response);
  };

  return (
    <>
      <PageTitle
        title="Edit User"
        description="You can edit your users from here"
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          <Input
            defaultValue={user ? user.username : ""}
            error={errors.username?.message}
            {...register("username")}
            placeholder="Username..."
          />
          {user && (
            <Select
              onValueChange={(v: string) => setValue("roleId", Number(v))}
              error={errors.roleId?.message}
              isLoading={isRolesLoading || isUserLoading}
              placeholder="Select role"
              options={
                roles?.data.map((role) => ({
                  value: String(role.id),
                  name: role.name,
                })) ?? []
              }
              defaultValue={String(user.roleId)}
            />
          )}
          <Input
            defaultValue={user ? user.email : ""}
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
            defaultValue={user && user.url ? user.url : ""}
            error={errors.url?.message}
            {...register("url")}
            placeholder="Url..."
          />
          <TextArea
            defaultValue={user && user.bio ? user.bio : ""}
            error={errors.bio?.message}
            {...register("bio")}
            placeholder="Bio..."
          />
        </FormBody>
        <FormFooter>
          <Button isLoading={isLoading}>Edit user</Button>
        </FormFooter>
      </Form>
    </>
  );
}, [ROLES.ADMIN]);

export default Edit;
