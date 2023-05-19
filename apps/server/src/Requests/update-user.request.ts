import { database, defaultRoles } from "@src/lib/database";
import { AuthRequest, ValidateAuthorize, ValidateParse } from "@src/types";
import { z } from "zod";

export interface UpdateUserRequest extends AuthRequest {
  body: {
    username?: string;
    email?: string;
    password?: string;
    bio?: string;
    url?: string;
    roleId?: number;
  };
}

export const updateUserRequest: {
  parse: ValidateParse;
  authorize: ValidateAuthorize;
} = {
  parse: (request: AuthRequest) => {
    const schema = z
      .object({
        username: z
          .string()
          .min(1)
          .refine(
            async (username) =>
              !(await database.user.findUnique({ where: { username } })),
            { message: "Username is already taken" }
          )
          .optional(),
        email: z
          .string()
          .email()
          .refine(
            async (email) =>
              !(await database.user.findUnique({ where: { email } })),
            { message: "Email address is already taken" }
          )
          .optional(),
        url: z.string().url().optional(),
        bio: z.string().min(1).optional(),
        password: z.string().min(8).optional(),
        password_confirmation: z.string().min(8).optional(),
        roleId: z
          .number()
          .refine(
            async (id) => await database.role.findUnique({ where: { id } }),
            { message: "Role does not exists" }
          )
          .optional(),
      })
      .refine(
        ({ password, password_confirmation }) => {
          if (password || password_confirmation) {
            return password_confirmation === password;
          }

          return true;
        },
        {
          path: ["password_confirmation"],
          message: "Password and Password confirmation does not match",
        }
      );

    return schema.safeParseAsync(request.body);
  },
  authorize: (request: AuthRequest) => {
    const { user } = request.auth!;
    return user.roleId === defaultRoles.ADMIN;
  },
};
