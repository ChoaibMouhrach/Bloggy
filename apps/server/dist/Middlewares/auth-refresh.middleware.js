"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "authRefreshMiddleware", {
    enumerable: true,
    get: function() {
        return authRefreshMiddleware;
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
const authRefreshMiddleware = async (request, _response, next)=>{
    // extract authorization
    const { authorization  } = request.headers;
    // check if authorization exists with the token
    if (!authorization || !authorization.split(" ")[1]) {
        throw new _Exceptions.UnauthorizedException();
    }
    // extract token
    const token = authorization.split(" ")[1];
    // user id
    let id;
    try {
        // decode token
        const decoded = _jsonwebtoken.default.verify(token, _config.default.SECRET_REFRESH);
        // set user id
        id = decoded.id;
    } catch (err) {
        throw new _Exceptions.UnauthorizedException(err.message);
    }
    // retrieve user
    const user = await _database.database.user.findUnique({
        where: {
            id
        }
    });
    // check user existance
    if (!user) {
        throw new _Exceptions.NotFoundException("User");
    }
    // retrieve refreshTokens
    const tokens = await _database.database.refreshToken.findMany({
        where: {
            userId: user.id,
            token
        }
    });
    // check tokens length
    if (!tokens.length) {
        throw new _Exceptions.UnauthorizedException();
    }
    // set user in token
    request.auth = {
        token,
        user
    };
    next();
};
