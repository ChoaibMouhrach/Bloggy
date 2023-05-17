import { Request } from "express";
import { z } from "zod";
import { compareSync } from "bcrypt";
import { database } from "@src/lib/database";
import { ValidateParse, AuthRequest } from "@src/types";

const findUser = (email: string) => {
  return database.user.findUnique({
    where: { email },
  });
};

const parse: ValidateParse = (request: AuthRequest) => {
  const schema = z
    .object({
      email: z
        .string()
        .email()
        .refine(async (email) => findUser(email), {
          message: "Email address or password is not correct",
        }),
      password: z.string().min(8),
    })
    .refine(
      async (data) => {
        const user = await findUser(data.email);
        return user && compareSync(data.password, user.password);
      },
      { message: "Email address or password is not correct", path: ["email"] }
    );

  return schema.safeParseAsync(request.body);
};

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const loginRequest = {
  parse,
};

export default loginRequest;
