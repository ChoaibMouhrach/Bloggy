import { ValidateParse } from "@src/types";
import { Request } from "express";
import { z } from "zod";

const parse: ValidateParse = (request: Request) => {
  const schema = z.object({
    email: z.string().email(),
  });

  return schema.safeParseAsync(request.body);
};

export interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

export const forgotPasswordRequest = {
  parse,
};
