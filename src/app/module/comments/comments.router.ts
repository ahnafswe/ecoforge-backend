import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { commentsController } from "./comments.controller";
import { createCommentSchema } from "./comments.validation";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
	"/:ideaId",
	auth(),
	validateRequest(createCommentSchema),
	commentsController.createComment,
);

router.get("/:ideaId", commentsController.getComments);

router.delete("/:id", auth(UserRole.ADMIN), commentsController.deleteComment);

export const commentsRouter = router;
