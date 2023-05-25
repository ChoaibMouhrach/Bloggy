"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "updatePostRequest", {
    enumerable: true,
    get: function() {
        return updatePostRequest;
    }
});
const _database = require("../lib/database");
const _zod = require("zod");
const authorize = (request)=>{
    const { user  } = request.auth;
    return user.roleId === _database.defaultRoles.ADMIN;
};
const parse = (request)=>{
    const rule = _zod.z.array(_zod.z.number().refine(async (id)=>{
        return await _database.database.tag.findUnique({
            where: {
                id
            }
        });
    }, {
        message: "Tag does not exists"
    })).refine((tags)=>tags.length, {
        message: "At least one tag is required"
    }).optional();
    const schema = _zod.z.object({
        title: _zod.z.string().min(1).optional(),
        content: _zod.z.string().min(1).optional(),
        isDraft: _zod.z.boolean().optional(),
        tags: rule,
        addTags: rule,
        removeTags: rule
    }).refine((data)=>Object.keys(data).length, {
        message: "Chnage Something first",
        path: [
            "root"
        ]
    });
    return schema.safeParseAsync(request.body);
};
const updatePostRequest = {
    authorize,
    parse
};
