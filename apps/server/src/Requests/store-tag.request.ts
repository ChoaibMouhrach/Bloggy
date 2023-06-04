import { database, defaultRoles } from "@src/lib/database";
import { AuthRequest, ValidateAuthorize, ValidateParse } from "@src/types";
import { Request } from "express";
import { z } from "zod";

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!;
  return user.roleId === defaultRoles.ADMIN;
};

const parse: ValidateParse = (request: AuthRequest) => {
  const schema = z.object({
    name: z
      .string()
      .min(1)
      .refine(
        async (name) => {
          return !(await database.tag.findUnique({
            where: {
              name,
            },
          }));
        },
        { message: "Tag is already taken" }
      ),
  });

  return schema.safeParseAsync(request.body);
};

export interface StoreTagRequest extends Request {
  body: {
    name: string;
  };
}

export const storeTagRequest = {
  parse,
  authorize,
};
