"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorHandler", {
    enumerable: true,
    get: function() {
        return errorHandler;
    }
});
const _Exceptions = require("../Exceptions");
function errorHandler(error, _request, response, _next) {
    if (error instanceof _Exceptions.HttpException) {
        return response.status(error.status).json(error.getBody());
    }
    console.log(error);
    return response.status(500).json(_Exceptions.HttpException.createBody(500, error.message, "Internal Server Error"));
}
