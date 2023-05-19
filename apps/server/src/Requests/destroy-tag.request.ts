import { database, defaultRoles } from "@src/lib/database";
import { AuthRequest, ValidateAuthorize, ValidateParse } from "@src/types";
import { z } from "zod";
import { Request } from "express";

export interface DestroyTagRequest extends Request {
  body: {
    id: number;
  };
}

const parse: ValidateParse = (request: AuthRequest) => {
  const schema = z.object({
    id: z
      .string()
      .regex(/^\d+$/gi)
      .transform((id) => Number(id))
      .pipe(
        z.number().refine(async (id) => {
          return await database.tag.findUnique({
            where: {
              id,
            },
          });
        })
      ),
  });

  return schema.safeParseAsync(request.params);
};

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!;
  return user.roleId === defaultRoles.ADMIN;
};

export const destroyTagRequest = {
  parse,
  authorize,
};
