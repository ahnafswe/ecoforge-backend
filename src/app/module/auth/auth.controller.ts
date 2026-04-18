import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { authService } from "./auth.service";
import { responseUtils } from "../../utils/response";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";

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

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
	const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

	const result = await authService.logoutUser(sessionToken);

	tokenUtils.clearTokenCookies(res);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "User logged out successfully",
		data: result,
	});
});

const renewTokens = asyncHandler(async (req: Request, res: Response) => {
	const refreshToken = cookieUtils.getCookie(req, "refresh_token");
	const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

	const result = await authService.renewTokens(refreshToken, sessionToken);

	tokenUtils.setAccessTokenCookie(res, result.accessToken);
	tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
	tokenUtils.setSessionTokenCookie(res, result.sessionToken);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.CREATED,
		message: "Tokens renewed successfully",
		data: result,
	});
});

export const authController = {
	signupMember,
	loginUser,
	logoutUser,
	renewTokens,
};
