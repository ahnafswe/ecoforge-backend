import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { usersController } from "./users.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { updateUserStatusSchema } from "./users.validation";

const router = Router();

router.get("/me", auth(), usersController.getMe);

router.get("/", auth(UserRole.ADMIN), usersController.getUsers);

router.patch("/:id/role", auth(UserRole.ADMIN), usersController.updateUserRole);

router.patch(
	"/:id/status",
	auth(UserRole.ADMIN),
	validateRequest(updateUserStatusSchema),
	usersController.updateUserStatus,
);

export const usersRouter = router;
