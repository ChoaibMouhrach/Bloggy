import { roleController } from "@src/Controllers";
import { authAccessMiddleware, validate } from "@src/Middlewares";
import destroyRoleRequest from "@src/Requests/destroy-role.request";
import storeRoleRequest from "@src/Requests/store-role.request";
import updateRoleRequest from "@src/Requests/update-role.request";
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
