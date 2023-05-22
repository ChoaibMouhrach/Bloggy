import { Button, Input, TextArea } from "ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { IStoreUser, IResponseError } from "@/index";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRegisterMutation } from "@/features/apis/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/slices/userSlice";
import Link from "next/link";
import { handleResponseError } from "@/helpers";
import { withGuest } from "@/middlewares";

const schema = z.object({
  username: z.string().min(3).max(60),
  url: z.string().optional(),
  bio: z.string().max(255).optional(),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
});

const Register = withGuest(() => {
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IStoreUser>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IStoreUser) => {
    if (data.bio == "") {
      delete data.bio;
    }

    if (data.url == "") {
      delete data.url;
    }

    const response = await registerUser(data);

    if ("data" in response) {
      dispatch(setUser(response.data));
    }

    handleResponseError(setError, response);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-4 lg:mx-0 flex flex-col gap-4 sm:max-w-lg"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold tracking-wide">ChoaibMouhrach</h2>
          <p className="font-medium text-stone-500">
            Enter your email to create an account
          </p>
        </div>

        <Input
          error={errors.username?.message}
          {...register("username")}
          type="text"
          name="username"
          placeholder="Username..."
        />

        <Input
          error={errors.email?.message}
          {...register("email")}
          type="email"
          name="email"
          placeholder="Email Address..."
        />
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
          placeholder="Password Confirmation..."
        />

        <Input
          error={errors.url?.message}
          {...register("url")}
          type="url"
          name="url"
          placeholder="websilte..."
        />
        <TextArea
          error={errors.bio?.message}
          {...register("bio")}
          placeholder="Bio..."
        ></TextArea>

        <Button disabled={isLoading} type="submit">
          Sign Up{" "}
          {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}{" "}
        </Button>

        <div className="text-center">
          <span className="text-stone-500">Already have an account ? </span>
          <Link href="/sign-in">Sign In</Link>
        </div>
      </form>
    </main>
  );
});

export default Register;
