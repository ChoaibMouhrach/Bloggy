"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "changePasswordRequest", {
    enumerable: true,
    get: function() {
        return changePasswordRequest;
    }
});
const _bcrypt = require("bcrypt");
const _zod = require("zod");
const parse = (request)=>{
    const schema = _zod.z.object({
        // old password
        password: _zod.z.string().min(8).refine(async (password)=>{
            // retrieve user from request
            const { user  } = request.auth;
            // compare passwords
            return (0, _bcrypt.compareSync)(password, user.password);
        }, {
            message: "Password is not correct"
        }),
        // new password
        newPassword: _zod.z.string().min(8),
        // new password confirmation
        password_confirmation: _zod.z.string().min(8)
    }).refine((data)=>data.newPassword === data.password_confirmation, {
        message: "New Password and Password confirmation does not match",
        path: [
            "password_confirmation"
        ]
    });
    return schema.safeParseAsync(request.body);
};
const changePasswordRequest = {
    parse
};
