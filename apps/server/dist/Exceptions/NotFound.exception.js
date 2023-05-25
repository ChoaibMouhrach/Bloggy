"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotFoundException", {
    enumerable: true,
    get: function() {
        return NotFoundException;
    }
});
const _Httpexception = require("./Http.exception");
class NotFoundException extends _Httpexception.HttpException {
    constructor(content){
        super({
            message: "Not Found",
            status: 404,
            content: `${content} does not exist`
        });
    }
}
