"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "updateTagRequest", {
    enumerable: true,
    get: function() {
        return updateTagRequest;
    }
});
const _database = require("../lib/database");
const _zod = require("zod");
const authorize = (request)=>{
    const { user  } = request.auth;
    return user.roleId === _database.defaultRoles.ADMIN;
};
const parse = async (request)=>{
    const schema = _zod.z.object({
        id: _zod.z.string().regex(/^\d+$/gi).transform((v)=>Number(v)).pipe(_zod.z.number().refine(async (id)=>await _database.database.tag.findUnique({
                where: {
                    id
                }
            }), {
            message: "Tag does not exists"
        })),
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
    return schema.safeParseAsync({
        ...request.body,
        ...request.params
    });
};
const updateTagRequest = {
    parse,
    authorize
};
