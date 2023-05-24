import { withGuest } from "@/middlewares";
import { useForm } from "react-hook-form";
import { Button, Input } from "ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/features/apis/authApi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { IForgotPassword } from "..";
import { handleResponseError } from "@/helpers";
import { useRouter } from "next/router";
import useToast from "@/hooks/useToast";
import { AuthLayout } from "@/Components/Layouts/AuthLayout";

const schema = z.object({
  email: z.string().email(),
});

const ForgotPassword = withGuest(() => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { t } = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<IForgotPassword>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IForgotPassword) => {
    const response = await forgotPassword(data);

    if ("data" in response) {
      t([
        {
          state: "success",
          title: "Check your inbox",
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
            Enter your email to reset your password
          </p>
        </div>

        <Input
          {...register("email")}
          error={errors.email?.message}
          type="email"
          name="email"
          placeholder="Email Address..."
        />

        <Button disabled={isLoading} type="submit">
          Reset Password {"  "}{" "}
          {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </Button>

        <div className="text-center">
          <span className="text-stone-500">You have an account ? </span>
          <Link href="/sign-in">Sign In</Link>
        </div>
        <div className="text-center">
          <span className="text-stone-500">Don't have an account ? </span>
          <Link href="/sign-up">Sign Up</Link>
        </div>
      </form>
    </AuthLayout>
  );
});

export default ForgotPassword;
