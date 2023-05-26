"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HttpException", {
    enumerable: true,
    get: function() {
        return HttpException;
    }
});
class HttpException extends Error {
    // message
    message;
    // response content
    content;
    // response status
    status;
    constructor({ message , content , status  }){
        super(message);
        this.message = message;
        this.content = content;
        this.status = status;
    }
    // body format
    getBody() {
        return {
            statusCode: this.status,
            message: this.content,
            error: this.message
        };
    }
    static createBody(statusCode, message, error) {
        return {
            statusCode,
            message,
            error
        };
    }
}
