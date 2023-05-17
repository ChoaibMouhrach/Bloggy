import z from "zod";
import { Request } from "express";
import { database } from "@src/lib/database";
import { ValidateParse } from "@src/types";

const parse: ValidateParse = (request: Request) => {
  const schema = z
    .object({
      username: z
        .string()
        .min(3)
        .max(60)
        .refine(
          async (username) =>
            !(await database.user.findUnique({ where: { username } })),
          { message: "Username is already taken" }
        ),
      url: z.string().url(),
      email: z
        .string()
        .email()
        .refine(
          async (email) =>
            !(await database.user.findUnique({ where: { email } })),
          { message: "Email address is already taken" }
        ),
      bio: z.string().max(255).optional(),
      password: z.string().min(1).min(8),
      password_confirmation: z.string().min(8),
    })
    .refine(
      (data) => {
        return data.password === data.password_confirmation;
      },
      {
        message: "Password and Password confirmation does not match",
        path: ["password_confirmation"],
      }
    );

  return schema.safeParseAsync(request.body);
};

export interface RegisterRequest extends Request {
  body: {
    username: string;
    bio: string;
    url: string;
    email: string;
    password: string;
    password_confirmation: string;
  };
}

const registerRequest = {
  parse,
};

export default registerRequest;
