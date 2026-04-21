import { Router } from "express";
import { authRouter } from "../module/auth/auth.router";
import { categoriesRouter } from "../module/categories/categories.router";
import { commentsRouter } from "../module/comments/comments.router";
import { ideaModerationRouter } from "../module/ideaModeration/ideaModeration.router";
import { ideasRouter } from "../module/ideas/ideas.router";
import { usersRouter } from "../module/users/users.router";
import { votesRouter } from "../module/votes/votes.router";
import { paymentsRouter } from "../module/payments/payments.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/ideas", ideasRouter);
router.use("/ideas/admin", ideaModerationRouter);
router.use("/vote", votesRouter);
router.use("/comments", commentsRouter);
router.use("/payments", paymentsRouter);

export const indexRouter = router;
