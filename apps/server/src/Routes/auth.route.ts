import { Router } from "express";
import { authController } from "../Controllers";

export const authRouter = Router();

// login user
authRouter.post("/login", authController.login);

// register user
authRouter.post("/register", authController.register);

// refresh user access token
authRouter.post("/refresh", authController.refresh);

// get user profile
authRouter.get("/me", authController.profile);

// update user profile
authRouter.patch("/me", authController.updateProfile);

// change password
authRouter.patch("/change-password", authController.updateProfile);

// send forgot password email
authRouter.post("/forgot-password", authController.forgotPassword);

// reset user password
authRouter.post("/reset-password/:token", authController.resetPassword);

// send confirmation email
authRouter.post(
  "/send-confirmation-email",
  authController.sendConfirmationEmail
);

// confirm email
authRouter.post("/confirm-email/:token", authController.confirmEmail);
