import { database, defaultRoles } from "@src/lib/database";
import { AuthRequest, ValidateAuthorize, ValidateParse } from "@src/types";
import { z } from "zod";

export interface UpdatePostRequest extends AuthRequest {
  body: {
    title?: string;
    content?: string;
    isDraft?: boolean;
    tags?: number[];
    addTags?: number[];
    removeTags?: number[];
  };
}

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!;
  return user.roleId === defaultRoles.ADMIN;
};

const parse: ValidateParse = (request: AuthRequest) => {
  const rule = z
    .array(
      z.number().refine(
        async (id) => {
          return await database.tag.findUnique({ where: { id } });
        },
        { message: "Tag does not exists" }
      )
    )
    .refine((tags) => tags.length, { message: "At least one tag is required" })
    .optional();

  const schema = z
    .object({
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      isDraft: z.boolean().optional(),
      tags: rule,
      addTags: rule,
      removeTags: rule,
    })
    .refine((data) => Object.keys(data).length, {
      message: "Chnage Something else",
      path: ["root"],
    });

  return schema.safeParseAsync(request.body);
};

export const updatePostRequest = {
  authorize,
  parse,
};
