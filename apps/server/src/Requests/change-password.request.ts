import { AuthRequest, ValidateParse } from "@src/types";
import { compareSync } from "bcrypt";
import { z } from "zod";

const parse: ValidateParse = (request: AuthRequest) => {
  const schema = z
    .object({
      // old password
      password: z
        .string()
        .min(8)
        .refine(
          async (password) => {
            // retrieve user from request
            const { user } = request.auth!;

            // compare passwords
            return compareSync(password, user.password);
          },
          { message: "Password is not correct" }
        ),

      // new password
      newPassword: z.string().min(8),

      // new password confirmation
      password_confirmation: z.string().min(8),
    })
    .refine((data) => data.newPassword === data.password_confirmation, {
      message: "New Password and Password confirmation does not match",
      path: ["password_confirmation"],
    });

  return schema.safeParseAsync(request.body);
};

export interface ChangePasswordRequest extends AuthRequest {
  body: {
    newPassword: string;
    password: string;
    password_confirmation: string;
  };
}

const changePasswordRequest = {
  parse,
};

export default changePasswordRequest;
