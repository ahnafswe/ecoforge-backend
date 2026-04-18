import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { authService } from "./auth.service";
import { responseUtils } from "../../utils/response";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

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

const loginUser = asyncHandler(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await authService.loginUser(payload);
	const { token: sessionToken, accessToken, refreshToken, ...rest } = result;

	tokenUtils.setAccessTokenCookie(res, accessToken);
	tokenUtils.setRefreshTokenCookie(res, refreshToken);
	tokenUtils.setSessionTokenCookie(res, sessionToken);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.CREATED,
		message: "User logged in successfully",
		data: {
			sessionToken,
			accessToken,
			refreshToken,
			...rest,
		},
	});
});

export const authController = {
	signupMember,
	loginUser,
};
