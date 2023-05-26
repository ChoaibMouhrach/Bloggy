"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "forgotPasswordRequest", {
    enumerable: true,
    get: function() {
        return forgotPasswordRequest;
    }
});
const _zod = require("zod");
const parse = (request)=>{
    const schema = _zod.z.object({
        email: _zod.z.string().email()
    });
    return schema.safeParseAsync(request.body);
};
const forgotPasswordRequest = {
    parse
};
