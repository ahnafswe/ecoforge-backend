import { Router } from "express";
import { authRouter } from "../module/auth/auth.router";

const router = Router();

router.use("/auth", authRouter);

export const indexRouter = router;
