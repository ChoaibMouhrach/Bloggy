import { database, defaultRoles } from "@src/lib/database";
import { AuthRequest, ValidateAuthorize, ValidateParse } from "@src/types";
import { z } from "zod";

export interface StorePostRequest extends AuthRequest {
  body: {
    title: string;
    content: string;
    isDraft: boolean;
    tags: number[];
  };
}

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!;
  return user.roleId === defaultRoles.ADMIN;
};

const parse: ValidateParse = (request: AuthRequest) => {
  const schema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    isDraft: z.boolean().default(true),
    tags: z
      .array(
        z.number().refine(
          async (id) => {
            return await database.tag.findUnique({ where: { id } });
          },
          { message: "Tag does not exists" }
        )
      )
      .refine((tags) => tags.length, {
        message: "At least one tag is required",
      }),
  });

  return schema.safeParseAsync(request.body);
};

export const storePostRequest = {
  authorize,
  parse,
};
