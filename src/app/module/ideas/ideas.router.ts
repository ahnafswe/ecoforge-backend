import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { ideasController } from "./ideas.controller";
import { createIdeaSchema, updateIdeaSchema } from "./ideas.validation";

const router = Router();

router.post(
	"/",
	auth(UserRole.MEMBER),
	validateRequest(createIdeaSchema),
	ideasController.createIdea,
);

router.get("/", ideasController.getIdeas);

router.get("/my", auth(UserRole.MEMBER), ideasController.getMyIdeas);

router.get("/trend", auth(UserRole.ADMIN), ideasController.getIdeasTrend);

router.get("/:id", auth(), ideasController.getIdeaById);

router.patch(
	"/:id",
	auth(UserRole.MEMBER),
	validateRequest(updateIdeaSchema),
	ideasController.updateIdea,
);

router.delete("/:id", auth(), ideasController.deleteIdea);

export const ideasRouter = router;
