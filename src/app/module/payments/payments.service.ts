import SSLCommerzPayment from "sslcommerz-lts";
import { prisma } from "../../lib/prisma";
import status from "http-status";
import crypto from "crypto";
import { AppError } from "../../errors/AppError";
import { IHandleWebhookPayload } from "./payments.types";

const store_id = process.env.STORE_ID as string;
const store_passwd = process.env.STORE_PASSWORD as string;
const is_live = process.env.IS_LIVE === "true";

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

const initiatePayment = async (userId: string, ideaId: string) => {
	const idea = await prisma.idea.findUnique({
		where: { id: ideaId },
		include: {
			category: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!idea) {
		throw new AppError(status.NOT_FOUND, "Idea not found.");
	}

	if (!idea.isPaid || !idea.price) {
		throw new AppError(status.BAD_REQUEST, "Idea is not a paid one.");
	}

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	const transaction_id = `PAY-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

	await prisma.payment.create({
		data: {
			userId,
			ideaId,
			amount: idea.price,
			transactionId: transaction_id,
		},
	});

	const data = {
		total_amount: idea.price,
		currency: "BDT",
		transaction_id: transaction_id,
		success_url: `${process.env.FRONTEND_URL}/payment/success?transaction_id=${transaction_id}`,
		fail_url: `${process.env.FRONTEND_URL}/payment/failure?transaction_id=${transaction_id}`,
		cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
		ipn_url: `${process.env.BACKEND_URL}/api/v1/payments/webhook`,
		shipping_method: "No",
		product_name: idea.title,
		product_category: idea.category.name,
		product_profile: "non-physical-goods",
		cus_name: user?.name,
		cus_email: user?.email,
		cus_add1: "Bangladesh",
		cus_city: "Dhaka",
		cus_postcode: "1000",
		cus_country: "Bangladesh",
		cus_phone: "01711111111",
		cus_fax: "01711111111",
	};

	const apiResponse = await sslcz.init(data);

	if (apiResponse?.GatewayPageURL) {
		return apiResponse.GatewayPageURL;
	} else {
		throw new AppError(
			status.INTERNAL_SERVER_ERROR,
			"Failed to generate SSLCommerz Gateway URL",
		);
	}
};

const handleWebhook = async (payload: IHandleWebhookPayload) => {
	const { status, tran_id: transaction_id } = payload;

	if (!transaction_id) return false;

	if (status === "VALID" || status === "VALIDATED") {
		await prisma.payment.updateMany({
			where: { transactionId: transaction_id },
			data: { status: "COMPLETED" },
		});

		return true;
	} else {
		await prisma.payment.updateMany({
			where: { transactionId: transaction_id },
			data: { status: "FAILED" },
		});

		return false;
	}
};

export const paymentsService = {
	initiatePayment,
	handleWebhook,
};
