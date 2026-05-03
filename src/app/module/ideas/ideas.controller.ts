import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { ideasService } from "./ideas.service";
import { responseUtils } from "../../utils/response";
import status from "http-status";
import { getIdeasQuerySchema } from "./ideas.validation";

const createIdea = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user.id;
	const payload = req.body;

	const result = await ideasService.createIdea(userId, payload);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.CREATED,
		message: "Idea created successfully",
		data: result,
	});
});

const getIdeas = asyncHandler(async (req: Request, res: Response) => {
	const queries = getIdeasQuerySchema.parse(req.query);

	const result = await ideasService.getIdeas(queries);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Ideas retrieved successfully",
		data: result,
	});
});

const getIdeaById = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user.id;
	const ideaId = req.params.id as string;

	const result = await ideasService.getIdeaById(ideaId, userId);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Idea retrieved successfully",
		data: result,
	});
});

const getMyIdeas = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user.id;

	const result = await ideasService.getMyIdeas(userId);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Your ideas retrieved successfully",
		data: result,
	});
});

const getIdeasTrend = asyncHandler(async (req: Request, res: Response) => {
	const result = await ideasService.getIdeasTrend();

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Ideas trend retrieved successfully",
		data: result,
	});
});

const updateIdea = asyncHandler(async (req: Request, res: Response) => {
	const ideaId = req.params.id as string;
	const payload = req.body;

	const result = await ideasService.updateIdea(ideaId, payload);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Idea updated successfully",
		data: result,
	});
});

const deleteIdea = asyncHandler(async (req: Request, res: Response) => {
	const ideaId = req.params.id as string;

	const result = await ideasService.deleteIdea(ideaId);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Idea deleted successfully",
		data: result,
	});
});

export const ideasController = {
	createIdea,
	getIdeas,
	getIdeaById,
	getMyIdeas,
	getIdeasTrend,
	updateIdea,
	deleteIdea,
};
