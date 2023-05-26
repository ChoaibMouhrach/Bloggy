"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerRequest", {
    enumerable: true,
    get: function() {
        return registerRequest;
    }
});
const _zod = /*#__PURE__*/ _interop_require_default(require("zod"));
const _database = require("../lib/database");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const parse = (request)=>{
    const schema = _zod.default.object({
        username: _zod.default.string().min(3).max(60).refine(async (username)=>!await _database.database.user.findUnique({
                where: {
                    username
                }
            }), {
            message: "Username is already taken"
        }),
        url: _zod.default.string().url().optional(),
        email: _zod.default.string().email().refine(async (email)=>!await _database.database.user.findUnique({
                where: {
                    email
                }
            }), {
            message: "Email address is already taken"
        }),
        bio: _zod.default.string().min(1).max(255).optional(),
        password: _zod.default.string().min(8),
        password_confirmation: _zod.default.string().min(8)
    }).refine((data)=>{
        return data.password === data.password_confirmation;
    }, {
        message: "Password and Password confirmation does not match",
        path: [
            "password_confirmation"
        ]
    });
    return schema.safeParseAsync(request.body);
};
const registerRequest = {
    parse
};
