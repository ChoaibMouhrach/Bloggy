import { authController } from "@src/Controllers";
import {
  validate,
  authAccessMiddleware,
  authRefreshMiddleware,
} from "@src/Middlewares";
import {
  resetPasswordRequest,
  registerRequest,
  loginRequest,
  forgotPasswordRequest,
  changePasswordRequest,
  updateProfileRequest,
} from "@src/Requests";
import { Router } from "express";

export const authRouter = Router();

// login user
authRouter.post("/sign-in", [validate(loginRequest)], authController.signIn);

// login user
authRouter.post("/sign-out", authRefreshMiddleware, authController.signOut);

// register user
authRouter.post("/sign-up", validate(registerRequest), authController.signUp);

// refresh user access token
authRouter.post("/refresh", authRefreshMiddleware, authController.refresh);

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
