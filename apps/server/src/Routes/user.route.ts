import { userController } from "@src/Controllers";
import { authAccessMiddleware, validate } from "@src/Middlewares";
import {
  destroyUserRequest,
  indexUserRequest,
  showUserRequest,
  storeUserRequest,
  updateUserRequest,
} from "@src/Requests";
import { Router } from "express";

export const userRouter = Router();

userRouter.get(
  "/",
  [authAccessMiddleware, validate(indexUserRequest)],
  userController.index
);

userRouter.get(
  "/:id",
  [authAccessMiddleware, validate(showUserRequest)],
  userController.show
);

userRouter.post(
  "/",
  [authAccessMiddleware, validate(storeUserRequest)],
  userController.store
);

userRouter.patch(
  "/:id",
  [authAccessMiddleware, validate(updateUserRequest)],
  userController.update
);

userRouter.delete(
  "/:id",
  [authAccessMiddleware, validate(destroyUserRequest)],
  userController.destroy
);
