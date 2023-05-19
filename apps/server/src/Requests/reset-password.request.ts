import { ValidateParse } from "@src/types";
import { Request } from "express";
import z from "zod";

const parse: ValidateParse = (request: Request) => {
  const schema = z
    .object({
      password: z.string().min(8),
      password_confirmation: z.string().min(8),
    })
    .refine(
      ({ password, password_confirmation }) =>
        password === password_confirmation,
      { message: "Password and Password confirmation does not match." }
    );

  return schema.safeParse(request.body);
};

export interface ResetPasswordRequest extends Request {
  body: {
    password: string;
    password_confirmation: string;
  };
}

export const resetPasswordRequest = {
  parse,
};
