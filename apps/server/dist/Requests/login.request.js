"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "loginRequest", {
    enumerable: true,
    get: function() {
        return loginRequest;
    }
});
const _zod = require("zod");
const _bcrypt = require("bcrypt");
const _database = require("../lib/database");
const findUser = (email)=>{
    return _database.database.user.findUnique({
        where: {
            email
        }
    });
};
const parse = (request)=>{
    const schema = _zod.z.object({
        email: _zod.z.string().email().refine(async (email)=>findUser(email), {
            message: "Email address or password is not correct"
        }),
        password: _zod.z.string().min(8)
    }).refine(async (data)=>{
        const user = await findUser(data.email);
        return user && (0, _bcrypt.compareSync)(data.password, user.password);
    }, {
        message: "Email address or password is not correct",
        path: [
            "email"
        ]
    });
    return schema.safeParseAsync(request.body);
};
const loginRequest = {
    parse
};
