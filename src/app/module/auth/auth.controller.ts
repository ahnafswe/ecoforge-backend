import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { authService } from "./auth.service";
import { responseUtils } from "../../utils/response";
import status from "http-status";

const signupMember = asyncHandler(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await authService.signupMember(payload);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.CREATED,
		message: "Member signed up successfully",
		data: result,
	});
});

export const authController = {
	signupMember,
};
