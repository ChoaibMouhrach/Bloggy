"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnauthorizedException", {
    enumerable: true,
    get: function() {
        return UnauthorizedException;
    }
});
const _Httpexception = require("./Http.exception");
class UnauthorizedException extends _Httpexception.HttpException {
    constructor(content){
        super({
            message: "Unauthorized",
            content,
            status: 401
        });
    }
}
