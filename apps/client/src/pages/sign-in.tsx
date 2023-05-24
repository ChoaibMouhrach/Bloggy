import { Button, Input } from "ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ISignInUser } from "@/index";
import { useDispatch } from "react-redux";
import { useSignInMutation } from "@/features/apis/authApi";
import { setUser } from "@/features/slices/userSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/router";
import { withGuest } from "@/middlewares";
import { handleResponseError } from "@/helpers";
import { AuthLayout } from "@/Components/Layouts/AuthLayout";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const SignIn = withGuest(() => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signInUser, { isLoading }] = useSignInMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ISignInUser>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ISignInUser) => {
    const response = await signInUser(data);
    if ("data" in response) {
      dispatch(setUser(response.data));
      router.push("/dashboard");
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
            Enter your email to sign in to your account
          </p>
        </div>

        <Input
          error={errors.email?.message}
          {...register("email")}
          type="email"
          name="email"
          placeholder="Email Address..."
        />

        <div className="flex flex-col gap-2">
          <Link href="/forgot-password" className="text-sm">
            Forgot password ?
          </Link>
          <Input
            error={errors.password?.message}
            {...register("password")}
            type="password"
            name="password"
            placeholder="Password..."
          />
        </div>

        <Button disabled={isLoading} type="submit">
          Sign In{" "}
          {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </Button>

        <div className="text-center">
          <span className="text-stone-500">Don't have an account ? </span>
          <Link href="/sign-up">Sign Up</Link>
        </div>
      </form>
    </AuthLayout>
  );
});

export default SignIn;
