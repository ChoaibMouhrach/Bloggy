import { defaultRoles } from "@src/lib/database";
import { AuthRequest, ValidateAuthorize } from "@src/types";

export const showUserRequest: { authorize: ValidateAuthorize } = {
  authorize: (request: AuthRequest) => {
    const { user } = request.auth!;
    return user.roleId === defaultRoles.ADMIN;
  },
};
