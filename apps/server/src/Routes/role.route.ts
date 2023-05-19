import { roleController } from "@src/Controllers";
import { authAccessMiddleware, validate } from "@src/Middlewares";
import { updateRoleRequest, storeRoleRequest, destroyRoleRequest } from "@src/Requests";
import { Router } from "express";

export const roleRouter = Router();

roleRouter.get("/", roleController.index);

roleRouter.post(
  "/",
  [authAccessMiddleware, validate(storeRoleRequest)],
  roleController.store
);

roleRouter.patch(
  "/:id",
  [authAccessMiddleware, validate(updateRoleRequest)],
  roleController.update
);

roleRouter.delete(
  "/:id",
  [authAccessMiddleware, validate(destroyRoleRequest)],
  roleController.destroy
);
