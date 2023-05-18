import { defaultRoles } from "@src/lib/database";
import { ValidateAuthorize, AuthRequest } from "@src/types";

const authorize: ValidateAuthorize = (request: AuthRequest) => {
  const { user } = request.auth!;
  const { id } = request.params;

  // admin role id
  return (
    user.roleId === defaultRoles.ADMIN &&
    !Object.values(defaultRoles).includes(Number(id))
  );
};

const destroyRoleRequest = {
  authorize,
};

export default destroyRoleRequest;
