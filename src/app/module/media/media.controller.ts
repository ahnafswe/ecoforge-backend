import { Request, Response } from "express";
import { mediaService } from "./media.service";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { responseUtils } from "../../utils/response";
import status from "http-status";

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
	if (!req.file) {
		res.status(400).json({ success: false, message: "No image provided." });
		return;
	}

	const imageUrl = await mediaService.uploadImage(
		req.file.buffer,
		req.file.mimetype,
		"ecoforge_avatars",
	);

	return responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Avatar uploaded successfully",
		data: {
			imageUrl,
		},
	});
});
