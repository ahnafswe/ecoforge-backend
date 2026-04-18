import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { usersService } from "./users.service";
import status from "http-status";
import { responseUtils } from "../../utils/response";

const getMe = asyncHandler(async (req: Request, res: Response) => {
	const user = req.user;

	const result = await usersService.getMe(user);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "User retrieved successfully",
		data: result,
	});
});

const getUsers = asyncHandler(async (_req: Request, res: Response) => {
	const result = await usersService.getUsers();

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Users retrieved successfully",
		data: result,
	});
});

export const usersController = {
	getMe,
	getUsers,
};
