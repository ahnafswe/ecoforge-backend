import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { usersController } from "./users.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/me", auth(), usersController.getMe);
router.get("/", auth(UserRole.ADMIN), usersController.getUsers);

export const usersRouter = router;
