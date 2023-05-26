"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "storeTagRequest", {
    enumerable: true,
    get: function() {
        return storeTagRequest;
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
        name: _zod.z.string().min(1).refine(async (name)=>{
            return !await _database.database.tag.findUnique({
                where: {
                    name
                }
            });
        }, {
            message: "Tag is already taken"
        })
    });
    return schema.safeParseAsync(request.body);
};
const storeTagRequest = {
    parse,
    authorize
};
