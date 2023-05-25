"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BadRequestException", {
    enumerable: true,
    get: function() {
        return BadRequestException;
    }
});
const _Httpexception = require("./Http.exception");
class BadRequestException extends _Httpexception.HttpException {
    constructor(content){
        super({
            message: "Bad Request",
            status: 400,
            content
        });
    }
}
