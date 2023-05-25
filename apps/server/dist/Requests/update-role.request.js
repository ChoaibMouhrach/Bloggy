"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "updateRoleRequest", {
    enumerable: true,
    get: function() {
        return updateRoleRequest;
    }
});
const _database = require("../lib/database");
const _zod = /*#__PURE__*/ _interop_require_default(require("zod"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const parse = (request)=>{
    // schema
    const schema = _zod.default.object({
        name: _zod.default.string().min(1).max(60).refine(async (name)=>!await _database.database.role.findUnique({
                where: {
                    name
                }
            }), {
            message: "Role already exists"
        })
    });
    // validation
    return schema.safeParseAsync(request.body);
};
const authorize = (request)=>{
    const { user  } = request.auth;
    // admin role id
    return user.roleId === _database.defaultRoles.ADMIN;
};
const updateRoleRequest = {
    parse,
    authorize
};
