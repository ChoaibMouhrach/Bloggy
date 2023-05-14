import { Router } from "express";
import { authRouter } from "./auth.route";

const router = Router();

// auth router
router.use(authRouter);

export default router;
