import { Router } from "express";
import { authRouter } from "./auth.route";
import { roleRouter } from "./role.route";
import { userRouter } from "./user.route";
import { tagRouter } from "./tag.route";

const router = Router();

// auth router
router.use("/", authRouter);
router.use("/roles", roleRouter);
router.use("/users", userRouter);
router.use("/tags", tagRouter);

export default router;
