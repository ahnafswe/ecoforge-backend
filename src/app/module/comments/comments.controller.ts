import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { commentsService } from "./comments.service";
import { responseUtils } from "../../utils/response";
import status from "http-status";

const createComment = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user.id;
	const ideaId = req.params.ideaId as string;
	const payload = req.body;

	const result = await commentsService.createComment(userId, ideaId, payload);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.CREATED,
		message: "Comment added successfully",
		data: result,
	});
});

const getComments = asyncHandler(async (req: Request, res: Response) => {
	const ideaId = req.params.ideaId as string;

	const result = await commentsService.getComments(ideaId);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Comments retrieved successfully",
		data: result,
	});
});

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
	const commentId = req.params.id as string;

	const result = await commentsService.deleteComment(commentId);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Comment deleted successfully",
		data: result,
	});
});

export const commentsController = {
	createComment,
	getComments,
	deleteComment,
};
