import { postController } from "@src/Controllers/post.controller";
import { authAccessMiddleware, validate } from "@src/Middlewares";
import {
  destroyPostRequest,
  storePostRequest,
  updatePostRequest,
} from "@src/Requests";
import { Router } from "express";

export const postRouter = Router();

postRouter.get("/", postController.index);

postRouter.get("/:id", postController.show);

postRouter.post(
  "/",
  [authAccessMiddleware, validate(storePostRequest)],
  postController.store
);

postRouter.patch(
  "/:id",
  [authAccessMiddleware, validate(updatePostRequest)],
  postController.update
);

postRouter.delete(
  "/:id",
  [authAccessMiddleware, validate(destroyPostRequest)],
  postController.destroy
);
