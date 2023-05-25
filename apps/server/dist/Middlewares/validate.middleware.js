"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validate", {
    enumerable: true,
    get: function() {
        return validate;
    }
});
const _Exceptions = require("../Exceptions");
const validate = ({ parse , authorize  })=>{
    return async (request, _response, next)=>{
        if (authorize) {
            const authorization = Boolean(authorize(request));
            if (!authorization) {
                throw new _Exceptions.UnauthorizedException(undefined);
            }
        }
        if (parse) {
            const validation = await parse(request);
            if (!validation.success) {
                throw new _Exceptions.BadRequestException(validation.error.issues);
            }
            request.body = validation.data;
        }
        next();
    };
};
