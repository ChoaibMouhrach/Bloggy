"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "authAccessMiddleware", {
    enumerable: true,
    get: function() {
        return authAccessMiddleware;
    }
});
const _Exceptions = require("../Exceptions");
const _config = /*#__PURE__*/ _interop_require_default(require("../lib/config"));
const _database = require("../lib/database");
const _jsonwebtoken = /*#__PURE__*/ _interop_require_default(require("jsonwebtoken"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const authAccessMiddleware = async (request, _response, next)=>{
    // get authorization header
    const { authorization  } = request.headers;
    // check if the authorization exists
    if (!authorization || !authorization.split(" ")[1]) {
        throw new _Exceptions.UnauthorizedException();
    }
    // extract token
    const token = authorization.split(" ")[1];
    // user id
    let id;
    try {
        // decoed token and extract id
        const decoded = _jsonwebtoken.default.verify(token, _config.default.SECRET_ACCESS);
        id = decoded.id;
    } catch (err) {
        // throw token issue
        throw new _Exceptions.UnauthorizedException(err.message);
    }
    // retrieve user
    const user = await _database.database.user.findUnique({
        where: {
            id
        },
        include: {
            Role: true
        }
    });
    // if user not found
    if (!user) {
        throw new _Exceptions.UnauthorizedException("User does not exists");
    }
    request.auth = {
        user,
        token
    };
    next();
};
