import { database } from "@src/lib/database";
import { ValidateParse, AuthRequest } from "@src/types";
import { Request } from "express";
import { z } from "zod";

const parse: ValidateParse = (request: Request) => {
  const schema = z.object({
    username: z
      .string()
      .min(3)
      .max(60)
      .refine(
        async (username) =>
          !(await database.user.findUnique({ where: { username } })),
        { message: "Username is already taken" }
      )
      .optional(),
    url: z.string().url().optional(),
    bio: z.string().min(1).max(255).optional(),
  });

  return schema.safeParseAsync(request.body);
};

export interface UpdateProfileRequest extends AuthRequest {
  body: {
    username?: string;
    url?: string;
    bio?: string;
  };
}

const updateProfileRequest = {
  parse,
};

export default updateProfileRequest;
