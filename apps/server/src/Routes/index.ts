import { Router } from "express";
import { authRouter } from "./auth.route";
import { roleRouter } from "./role.route";
import { userRouter } from "./user.route";

const router = Router();

// auth router
router.use("/", authRouter);
router.use("/roles", roleRouter);
router.use("/users", userRouter);

export default router;
