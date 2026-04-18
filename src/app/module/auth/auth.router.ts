import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest.middleware";
import { loginUserSchema, signupMemberSchema } from "./auth.validation";

const router = Router();

router.post("/signup", validateRequest(signupMemberSchema), authController.signupMember);
router.post("/login", validateRequest(loginUserSchema), authController.loginUser);

export const authRouter = router;
