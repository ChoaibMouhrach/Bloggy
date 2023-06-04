import { database, defaultRoles } from "@src/lib/database";
import { ValidateParse, ValidateAuthorize, AuthRequest } from "@src/types";
import { Request } from "express";
import z from "zod";

const parse: ValidateParse = (request: Request) => {
  // schema
  const schema = z.object({
    name: z
      .string()
      .min(1)
      .max(60)
      .refine(
        async (name) => !(await database.role.findUnique({ where: { name } })),
        { message: "Role already exists" }
      ),
  });

  // validation
  return schema.safeParseAsync(request.body);
};

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!;
  // admin role id
  return user.roleId === defaultRoles.ADMIN;
};

export interface UpdateRoleRequest extends AuthRequest {
  body: {
    name: string;
  };
}

export const updateRoleRequest = {
  parse,
  authorize,
};
