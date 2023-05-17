import { authController } from "@src/Controllers";
import { validate, authAccessMiddleware, authRefresh } from "@src/Middlewares";
import changePasswordRequest from "@src/Requests/change-password.request";
import forgotPasswordRequest from "@src/Requests/forgot-password.request";
import loginRequest from "@src/Requests/login.request";
import registerRequest from "@src/Requests/register.request";
import resetPasswordRequest from "@src/Requests/reset-password.request";
import updateProfileRequest from "@src/Requests/update-profile.request";
import { Router } from "express";

export const authRouter = Router();

// login user
authRouter.post("/login", [validate(loginRequest)], authController.login);

// register user
authRouter.post(
  "/register",
  validate(registerRequest),
  authController.register
);

// refresh user access token
authRouter.post("/refresh", authRefresh, authController.refresh);

// get user profile
authRouter.get("/me", authAccessMiddleware, authController.profile);

// update user profile
authRouter.patch(
  "/me",
  [authAccessMiddleware, validate(updateProfileRequest)],
  authController.updateProfile
);

// change password
authRouter.patch(
  "/change-password",
  [authAccessMiddleware, validate(changePasswordRequest)],
  authController.changePassword
);

// send forgot password email
authRouter.post(
  "/forgot-password",
  validate(forgotPasswordRequest),
  authController.forgotPassword
);

// reset user password
authRouter.post(
  "/reset-password/:token",
  validate(resetPasswordRequest),
  authController.resetPassword
);

// send confirmation email
authRouter.post(
  "/send-confirmation-email",
  authAccessMiddleware,
  authController.sendConfirmationEmail
);

// confirm email
authRouter.post(
  "/confirm-email/:token",
  authAccessMiddleware,
  authController.confirmEmail
);
