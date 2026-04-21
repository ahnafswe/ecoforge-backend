import { Request, Response } from "express";
import { paymentsService } from "./payments.service";
import { responseUtils } from "../../utils/response";
import status from "http-status";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";

const initiatePayment = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user.id;
	const { ideaId } = req.body;

	const gatewayUrl = await paymentsService.initiatePayment(userId, ideaId);

	responseUtils.sendSuccessResponse({
		res,
		statusCode: status.OK,
		message: "Payment initiated successfully",
		data: {
			paymentUrl: gatewayUrl,
		},
	});
});

const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
	await paymentsService.handleWebhook(req.body);

	res.status(status.OK).send("IPN Received");
});

export const paymentsController = {
	initiatePayment,
	handleWebhook,
};
