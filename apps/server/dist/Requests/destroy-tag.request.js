"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "destroyTagRequest", {
    enumerable: true,
    get: function() {
        return destroyTagRequest;
    }
});
const _database = require("../lib/database");
const _zod = require("zod");
const parse = (request)=>{
    const schema = _zod.z.object({
        id: _zod.z.string().regex(/^\d+$/gi).transform((id)=>Number(id)).pipe(_zod.z.number().refine(async (id)=>{
            return await _database.database.tag.findUnique({
                where: {
                    id
                }
            });
        }, {
            message: "Tag does not exist"
        }))
    });
    return schema.safeParseAsync(request.params);
};
const authorize = (request)=>{
    const { user  } = request.auth;
    return user.roleId === _database.defaultRoles.ADMIN;
};
const destroyTagRequest = {
    parse,
    authorize
};
