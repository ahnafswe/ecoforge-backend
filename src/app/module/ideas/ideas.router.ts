import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { ideasController } from "./ideas.controller";
import { createIdeaSchema } from "./ideas.validation";

const router = Router();

router.post(
	"/",
	auth(UserRole.MEMBER),
	validateRequest(createIdeaSchema),
	ideasController.createIdea,
);

router.get("/", ideasController.getIdeas);

export const ideasRouter = router;
