import { Router } from "express";
import { authRouter } from "./auth.route";
import { roleRouter } from "./role.route";

const router = Router();

// auth router
router.use("/", authRouter);
router.use("/roles", roleRouter);

export default router;
