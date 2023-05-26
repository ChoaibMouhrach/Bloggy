"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "authRouter", {
    enumerable: true,
    get: function() {
        return authRouter;
    }
});
const _Controllers = require("../Controllers");
const _Middlewares = require("../Middlewares");
const _Requests = require("../Requests");
const _express = require("express");
const authRouter = (0, _express.Router)();
// login user
authRouter.post("/sign-in", [
    (0, _Middlewares.validate)(_Requests.loginRequest)
], _Controllers.authController.signIn);
// login user
authRouter.post("/sign-out", _Middlewares.authRefreshMiddleware, _Controllers.authController.signOut);
// register user
authRouter.post("/sign-up", (0, _Middlewares.validate)(_Requests.registerRequest), _Controllers.authController.signUp);
// refresh user access token
authRouter.post("/refresh", _Middlewares.authRefreshMiddleware, _Controllers.authController.refresh);
// get user profile
authRouter.get("/me", _Middlewares.authAccessMiddleware, _Controllers.authController.profile);
// update user profile
authRouter.patch("/me", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.updateProfileRequest)
], _Controllers.authController.updateProfile);
// change password
authRouter.patch("/change-password", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.changePasswordRequest)
], _Controllers.authController.changePassword);
// send forgot password email
authRouter.post("/forgot-password", (0, _Middlewares.validate)(_Requests.forgotPasswordRequest), _Controllers.authController.forgotPassword);
// reset user password
authRouter.post("/reset-password/:token", (0, _Middlewares.validate)(_Requests.resetPasswordRequest), _Controllers.authController.resetPassword);
// send confirmation email
authRouter.post("/send-confirmation-email", _Middlewares.authAccessMiddleware, _Controllers.authController.sendConfirmationEmail);
// confirm email
authRouter.post("/confirm-email/:token", _Middlewares.authAccessMiddleware, _Controllers.authController.confirmEmail);
