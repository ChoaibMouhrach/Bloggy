import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button, Input } from "ui";
import { z } from "zod";
import { withGuest } from "@/middlewares";
import { IResetPassword } from "@/index";
import useToast from "@/hooks/useToast";
import { handleResponseError } from "@/helpers";
import { useResetPasswordMutation } from "@/features/apis/authApi";
import { AuthLayout } from "@/Components/Layouts/AuthLayout";

const schema = z
  .object({
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
  })
  .refine(
    ({ password, password_confirmation }) => password === password_confirmation,
    {
      message: "Password and Password confirmation does not match",
      path: ["password_confirmation"],
    }
  );

const ResetPassword = withGuest(() => {
  const router = useRouter();
  const token = router.query.token as string;

  const { t } = useToast();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IResetPassword["data"]>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IResetPassword["data"]) => {
    const response = await resetPassword({
      token,
      data,
    });

    if ("data" in response) {
      t([
        {
          state: "success",
          title: "Password reset finished successfully",
        },
      ]);
      router.push("/sign-in");
    }

    handleResponseError(setError, response);
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-4 lg:mx-0 flex flex-col gap-4 sm:max-w-md"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold tracking-wide">ChoaibMouhrach</h2>
          <p className="font-medium text-stone-500">
            Set a new Password for your account
          </p>
        </div>

        <Input
          error={errors.password?.message}
          {...register("password")}
          type="password"
          name="password"
          placeholder="Password..."
        />

        <Input
          error={errors.password_confirmation?.message}
          {...register("password_confirmation")}
          type="password"
          name="password_confirmation"
          placeholder="Password confirmation..."
        />

        <Button disabled={isLoading} type="submit">
          Reset Password{" "}
          {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </Button>

        <div className="text-center">
          <span className="text-stone-500">You have an account ? </span>
          <Link href="/sign-in">Sign In</Link>
        </div>
      </form>
    </AuthLayout>
  );
});

export default ResetPassword;
