import { tagController } from "@src/Controllers";
import { authAccessMiddleware, validate } from "@src/Middlewares";
import {
  destroyTagRequest,
  storeTagRequest,
  updateTagRequest,
} from "@src/Requests";
import { Router } from "express";

export const tagRouter = Router();

tagRouter.get("/", tagController.index);

tagRouter.post(
  "/",
  [authAccessMiddleware, validate(storeTagRequest)],
  tagController.store
);

tagRouter.patch(
  "/:id",
  [authAccessMiddleware, validate(updateTagRequest)],
  tagController.update
);

tagRouter.delete(
  "/:id",
  [authAccessMiddleware, validate(destroyTagRequest)],
  tagController.destroy
);
