import { Request, Response } from "express";
import { mediaService } from "./media.service";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { responseUtils } from "../../utils/response";
import status from "http-status";

const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
	if (!req.file) {
		res.status(400).json({ success: false, message: "No image provided." });
		return;
	}

	const imageUrl = await mediaService.uploadImage(
		req.file.buffer,
		req.file.mimetype,
		"ecoforge_avatars",
		128,
		128,
	);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.CREATED,
		message: "Avatar uploaded successfully",
		data: {
			imageUrl,
		},
	});
});

const uploadIdeaThumbnail = asyncHandler(async (req: Request, res: Response) => {
	if (!req.file) {
		res.status(400).json({ success: false, message: "No image provided." });
		return;
	}

	const imageUrl = await mediaService.uploadImage(
		req.file.buffer,
		req.file.mimetype,
		"ecoforge_idea_thumbnails",
		768,
		384,
	);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.CREATED,
		message: "Thumbnail uploaded successfully",
		data: {
			imageUrl,
		},
	});
});

export const mediaController = {
	uploadAvatar,
	uploadIdeaThumbnail,
};
