import { database, defaultRoles } from "@src/lib/database";
import { AuthRequest, ValidateAuthorize, ValidateParse } from "@src/types";
import z from "zod";

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!;
  return user.roleId === defaultRoles.ADMIN;
};

const parse: ValidateParse = (request: AuthRequest) => {
  const schema = z
    .object({
      username: z
        .string()
        .min(3)
        .refine(
          async (username) =>
            !(await database.user.findUnique({ where: { username } })),
          { message: "Username is already taken" }
        ),
      email: z
        .string()
        .email()
        .refine(
          async (email) =>
            !(await database.user.findUnique({ where: { email } })),
          { message: "Email address is already taken" }
        ),
      url: z.string().url().optional(),
      bio: z.string().min(1).optional(),
      password: z.string().min(8),
      password_confirmation: z.string().min(8),
      roleId: z
        .number()
        .refine(
          async (id) => await database.role.findUnique({ where: { id } }),
          { message: "Role does not exists" }
        ),
    })
    .refine(
      ({ password, password_confirmation }) =>
        password === password_confirmation,
      {
        path: ["password_confirmation"],
        message: "Password and Password confirmation does not exists",
      }
    );

  return schema.safeParseAsync(request.body);
};

export interface StoreUserRequest extends AuthRequest {
  body: {
    username: string;
    email: string;
    url?: string;
    bio?: string;
    password: string;
    roleId: number;
  };
}

export const storeUserRequest = {
  authorize,
  parse,
};
