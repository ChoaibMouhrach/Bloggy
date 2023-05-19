import { defaultRoles } from "@src/lib/database";
import { AuthRequest, ValidateAuthorize } from "@src/types";

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!
  return user.roleId === defaultRoles.ADMIN
}

export const indexUserRequest = {
  authorize
}
