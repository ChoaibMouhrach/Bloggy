import { database, defaultRoles } from "@src/lib/database";
import { AuthRequest, ValidateAuthorize, ValidateParse } from "@src/types";
import { Request } from "express";
import { z } from "zod";

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!;
  return user.roleId === defaultRoles.ADMIN;
};

const parse: ValidateParse = async (request: AuthRequest) => {
  const schema = z.object({
    id: z
      .string()
      .regex(/^\d+$/gi)
      .transform((v) => Number(v))
      .pipe(
        z.number().refine(
          async (id) =>
            await database.tag.findUnique({
              where: {
                id,
              },
            }),
          { message: "Tag does not exists" }
        )
      ),
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

  return schema.safeParseAsync({
    ...request.body,
    ...request.params,
  });
};

export interface UpdateTagRequest extends Request {
  body: {
    id: number;
    name: string;
  };
}

export const updateTagRequest = {
  parse,
  authorize,
};
