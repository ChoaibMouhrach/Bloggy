"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "storePostRequest", {
    enumerable: true,
    get: function() {
        return storePostRequest;
    }
});
const _database = require("../lib/database");
const _zod = require("zod");
const authorize = (request)=>{
    const { user  } = request.auth;
    return user.roleId === _database.defaultRoles.ADMIN;
};
const parse = (request)=>{
    const schema = _zod.z.object({
        title: _zod.z.string().min(1),
        content: _zod.z.string().min(1),
        isDraft: _zod.z.boolean().default(true),
        tags: _zod.z.array(_zod.z.number().refine(async (id)=>{
            return await _database.database.tag.findUnique({
                where: {
                    id
                }
            });
        }, {
            message: "Tag does not exists"
        })).refine((tags)=>tags.length, {
            message: "At least one tag is required"
        })
    });
    return schema.safeParseAsync(request.body);
};
const storePostRequest = {
    authorize,
    parse
};
