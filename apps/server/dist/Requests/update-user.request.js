"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "updateUserRequest", {
    enumerable: true,
    get: function() {
        return updateUserRequest;
    }
});
const _database = require("../lib/database");
const _zod = require("zod");
const updateUserRequest = {
    parse: (request)=>{
        const schema = _zod.z.object({
            username: _zod.z.string().min(1).refine(async (username)=>!await _database.database.user.findUnique({
                    where: {
                        username
                    }
                }), {
                message: "Username is already taken"
            }).optional(),
            email: _zod.z.string().email().refine(async (email)=>!await _database.database.user.findUnique({
                    where: {
                        email
                    }
                }), {
                message: "Email address is already taken"
            }).optional(),
            url: _zod.z.string().url().optional(),
            bio: _zod.z.string().min(1).optional(),
            password: _zod.z.string().min(8).optional(),
            password_confirmation: _zod.z.string().min(8).optional(),
            roleId: _zod.z.number().refine(async (id)=>await _database.database.role.findUnique({
                    where: {
                        id
                    }
                }), {
                message: "Role does not exists"
            }).optional()
        }).refine(({ password , password_confirmation  })=>{
            if (password || password_confirmation) {
                return password_confirmation === password;
            }
            return true;
        }, {
            path: [
                "password_confirmation"
            ],
            message: "Password and Password confirmation does not match"
        });
        return schema.safeParseAsync(request.body);
    },
    authorize: (request)=>{
        const { user  } = request.auth;
        return user.roleId === _database.defaultRoles.ADMIN;
    }
};
