"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "authController", {
    enumerable: true,
    get: function() {
        return authController;
    }
});
const _jsonwebtoken = /*#__PURE__*/ _interop_require_default(require("jsonwebtoken"));
const _bcrypt = require("bcrypt");
const _database = require("../lib/database");
const _Exceptions = require("../Exceptions");
const _config = /*#__PURE__*/ _interop_require_default(require("../lib/config"));
const _mail = /*#__PURE__*/ _interop_require_default(require("../lib/mail"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Login users
 * @param request Http Request
 * @param response Http Response
 */ const signIn = async (request, response)=>{
    // user email
    const { email  } = request.body;
    // retrieve user
    const user = await _database.database.user.findUnique({
        where: {
            email
        }
    });
    // check the user's existence
    if (!user) {
        throw new _Exceptions.NotFoundException("User");
    }
    // accessToken
    const accessToken = _jsonwebtoken.default.sign({
        id: user.id,
        jti: user.id
    }, _config.default.SECRET_ACCESS, {
        expiresIn: _config.default.DURATION_ACCESS
    });
    // refreshToken
    const refreshToken = _jsonwebtoken.default.sign({
        id: user.id,
        jti: user.id
    }, _config.default.SECRET_REFRESH);
    // create new refreshToken
    await _database.database.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id
        }
    });
    // remove password
    delete user.password;
    // return user with refreshToken
    return response.json({
        user,
        accessToken,
        refreshToken
    });
};
const signOut = async (request, response)=>{
    const { token  } = request.auth;
    await _database.database.refreshToken.delete({
        where: {
            token
        }
    });
    return response.sendStatus(204);
};
/**
 * Register users
 * @param request Http Request
 * @param response Http Response
 */ const signUp = async (request, response)=>{
    const { username , email , password , bio , url  } = request.body;
    // user
    const user = await _database.database.user.create({
        data: {
            username,
            email,
            bio,
            url,
            password: (0, _bcrypt.hashSync)(password, Number(_config.default.SALT)),
            roleId: _database.defaultRoles.MEMBER
        },
        include: {
            Role: true
        }
    });
    // accessToken
    const accessToken = _jsonwebtoken.default.sign({
        id: user.id,
        jti: user.id
    }, _config.default.SECRET_ACCESS, {
        expiresIn: _config.default.DURATION_ACCESS
    });
    // refresh token
    const refreshToken = _jsonwebtoken.default.sign({
        id: user.id,
        jti: user.id
    }, _config.default.SECRET_REFRESH);
    // create new refresh token
    await _database.database.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id
        }
    });
    // response
    return response.status(201).json({
        user: (0, _database.prepareUser)(user),
        accessToken,
        refreshToken
    });
};
/**
 * refresh access token
 * @param request Http Request
 * @param response Http Response
 */ const refresh = async (request, response)=>{
    // user
    const { user , token  } = request.auth;
    // new accessToken
    const accessToken = _jsonwebtoken.default.sign({
        id: user.id,
        jti: user.id
    }, _config.default.SECRET_ACCESS, {
        expiresIn: _config.default.DURATION_ACCESS
    });
    // new refreshToken
    const refreshToken = _jsonwebtoken.default.sign({
        id: user.id,
        jti: user.id
    }, _config.default.SECRET_REFRESH);
    // store new refreshToken
    await _database.database.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id
        }
    });
    // remove old token
    await _database.database.refreshToken.delete({
        where: {
            token
        }
    });
    return response.json({
        accessToken,
        refreshToken
    });
};
/**
 * Get user profile
 * @param request Http Request
 * @param response Http Response
 */ const profile = async (request, response)=>{
    // retrieve user from request
    const { user  } = request.auth;
    // return user
    return response.json((0, _database.prepareUser)(user));
};
/**
 * Update user profile
 * @param request Http Request
 * @param response Http Response
 */ const updateProfile = async (request, response)=>{
    // authenticated user
    const { user  } = request.auth;
    // update items
    const { username , url , bio  } = request.body;
    // update user
    await _database.database.user.update({
        where: {
            id: user.id
        },
        data: {
            username,
            url,
            bio
        }
    });
    // return updated user
    return response.sendStatus(204);
};
/**
 * Change user password
 * @param request Http Request
 * @param response Http Response
 */ const changePassword = async (request, response)=>{
    // extract password
    const { newPassword: password  } = request.body;
    // extract auth user
    let { user  } = request.auth;
    // update user password with hashed password
    user = await _database.database.user.update({
        where: {
            id: user.id
        },
        data: {
            password: (0, _bcrypt.hashSync)(password, Number(_config.default.SALT))
        }
    });
    // 204 success no response
    return response.sendStatus(204);
};
/**
 * Send forgot password email to user
 * @param request Http Request
 * @param response Http Response
 */ const forgotPassword = async (request, response)=>{
    // extract email
    const { email  } = request.body;
    // retrieve user using email
    const user = await _database.database.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        return response.status(200).json({
            message: "If the email is present in our database, a corresponding email will be sent to it."
        });
    }
    // issue new forgotpasswordtoken
    const token = _jsonwebtoken.default.sign({
        id: user.id,
        jti: user.id
    }, _config.default.SECRET_FORGOT_PASSWORD, {
        expiresIn: _config.default.DURATION_FORGOT_PASSWORD
    });
    // store token
    await _database.database.forgotPasswordToken.create({
        data: {
            token,
            userId: user.id
        }
    });
    // send email
    await _mail.default.sendMail({
        from: _config.default.SMTP_FROM_ADDRESS,
        to: user.email,
        subject: "Forgot Password",
        text: `${_config.default.CLIENT_URL}/reset-password/${token}`
    });
    // return 204
    return response.status(200).json({
        message: "If the email is present in our database, a corresponding email will be sent to it."
    });
};
/**
 * Reset user password
 * @param request Http Request
 * @param response Http Response
 */ const resetPassword = async (request, response)=>{
    // extract token
    const { token  } = request.params;
    // user id
    let id;
    try {
        // decode and verify token
        const decoded = _jsonwebtoken.default.verify(token, _config.default.SECRET_FORGOT_PASSWORD);
        // set user id
        id = decoded.id;
    } catch (err) {
        // token inavlid
        throw new _Exceptions.BadRequestException(err.message);
    }
    // retrieve user
    const user = await _database.database.user.findUnique({
        where: {
            id
        }
    });
    // user does not exists
    if (!user) throw new _Exceptions.NotFoundException("User");
    // retrieve tokens
    const tokens = await _database.database.forgotPasswordToken.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    // the used token does not match the last issued token
    if (!tokens.length || tokens[0].token !== token) {
        throw new _Exceptions.BadRequestException("Token is not valid");
    }
    // extract password from request body
    const { password  } = request.body;
    // update the user with hashed password
    await _database.database.user.update({
        where: {
            id: user.id
        },
        data: {
            password: (0, _bcrypt.hashSync)(password, Number(_config.default.SALT))
        }
    });
    // remove all tokens
    await _database.database.forgotPasswordToken.deleteMany({
        where: {
            userId: user.id
        }
    });
    // return success
    return response.sendStatus(204);
};
/**
 * Send user confirmation email
 * @param request Http Request
 * @param response Http Response
 */ const sendConfirmationEmail = async (request, response)=>{
    // retrieve user
    const { user  } = request.auth;
    // check if user is already verified
    if (user.verifiedAt) {
        throw new _Exceptions.BadRequestException("Already verified");
    }
    // create token
    const token = _jsonwebtoken.default.sign({
        id: user.id,
        jti: user.id
    }, _config.default.SECRET_CONFIRM_EMAIL, {
        expiresIn: _config.default.DURATION_CONFIRM_EMAIL
    });
    // store token
    await _database.database.confirmEmailToken.create({
        data: {
            token,
            userId: user.id
        }
    });
    // send email
    await _mail.default.sendMail({
        from: _config.default.SMTP_FROM_ADDRESS,
        to: user.email,
        subject: "Email address confirmation",
        html: `<a href="${_config.default.CLIENT_URL}/confirm-email/${token}" >Confirm</a>`
    });
    // return response
    return response.sendStatus(204);
};
/**
 * Confirm user email
 * @param request Http Request
 * @param response Http Response
 */ const confirmEmail = async (request, response)=>{
    // extract token
    const { token  } = request.params;
    // user id
    let id;
    try {
        // decode token
        const decoded = _jsonwebtoken.default.verify(token, _config.default.SECRET_CONFIRM_EMAIL);
        // set user id
        id = decoded.id;
    } catch (err) {
        throw new _Exceptions.BadRequestException(err.message);
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
    const tokens = await _database.database.confirmEmailToken.findMany({
        where: {
            token,
            userId: user.id
        }
    });
    if (!tokens.length) {
        throw new _Exceptions.BadRequestException("Token is not valid");
    }
    // update user
    await _database.database.user.update({
        where: {
            id: user.id
        },
        data: {
            verifiedAt: new Date()
        }
    });
    // destroy tokens
    await _database.database.confirmEmailToken.deleteMany({
        where: {
            userId: user.id
        }
    });
    // send success
    return response.sendStatus(204);
};
const authController = {
    signIn,
    signUp,
    signOut,
    profile,
    changePassword,
    updateProfile,
    forgotPassword,
    resetPassword,
    sendConfirmationEmail,
    confirmEmail,
    refresh
};
