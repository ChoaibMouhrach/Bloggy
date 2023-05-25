"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "updateProfileRequest", {
    enumerable: true,
    get: function() {
        return updateProfileRequest;
    }
});
const _database = require("../lib/database");
const _zod = require("zod");
const parse = (request)=>{
    const schema = _zod.z.object({
        username: _zod.z.string().min(3).max(60).refine(async (username)=>!await _database.database.user.findUnique({
                where: {
                    username
                }
            }), {
            message: "Username is already taken"
        }).optional(),
        url: _zod.z.string().url().optional(),
        bio: _zod.z.string().min(1).max(255).optional()
    });
    return schema.safeParseAsync(request.body);
};
const updateProfileRequest = {
    parse
};
