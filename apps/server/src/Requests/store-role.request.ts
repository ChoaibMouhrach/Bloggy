import { database, defaultRoles } from "@src/lib/database";
import { ValidateParse, ValidateAuthorize, AuthRequest } from "@src/types";
import { Request } from "express";
import z from "zod";

const parse: ValidateParse = (request: Request) => {
  const schema = z.object({
    name: z
      .string()
      .min(1)
      .refine(
        async (name) => !(await database.role.findUnique({ where: { name } })),
        { message: "Role already exists" }
      ),
  });
  return schema.safeParseAsync(request.body);
};

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!;
  // admin role id
  return user.roleId === defaultRoles.ADMIN;
};

export interface StoreRoleRequest extends AuthRequest {
  body: {
    name: string;
  };
}

export const storeRoleRequest = {
  parse,
  authorize,
};
