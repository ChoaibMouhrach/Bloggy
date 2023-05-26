"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "storeUserRequest", {
    enumerable: true,
    get: function() {
        return storeUserRequest;
    }
});
const _database = require("../lib/database");
const _zod = /*#__PURE__*/ _interop_require_default(require("zod"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const authorize = (request)=>{
    const { user  } = request.auth;
    return user.roleId === _database.defaultRoles.ADMIN;
};
const parse = (request)=>{
    const schema = _zod.default.object({
        username: _zod.default.string().min(3).refine(async (username)=>!await _database.database.user.findUnique({
                where: {
                    username
                }
            }), {
            message: "Username is already taken"
        }),
        email: _zod.default.string().email().refine(async (email)=>!await _database.database.user.findUnique({
                where: {
                    email
                }
            }), {
            message: "Email address is already taken"
        }),
        url: _zod.default.string().url().optional(),
        bio: _zod.default.string().min(1).optional(),
        password: _zod.default.string().min(8),
        password_confirmation: _zod.default.string().min(8),
        roleId: _zod.default.number().refine(async (id)=>await _database.database.role.findUnique({
                where: {
                    id
                }
            }), {
            message: "Role does not exists"
        })
    }).refine(({ password , password_confirmation  })=>password === password_confirmation, {
        path: [
            "password_confirmation"
        ],
        message: "Password and Password confirmation does not exists"
    });
    return schema.safeParseAsync(request.body);
};
const storeUserRequest = {
    authorize,
    parse
};
