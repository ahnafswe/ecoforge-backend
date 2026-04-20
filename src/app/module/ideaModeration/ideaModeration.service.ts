import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { IReviewIdeaPayload } from "./ideaModeration.types";

const getAllIdeas = async () => {
	const ideas = await prisma.idea.findMany({
		where: {
			isDeleted: false,
		},
		include: {
			author: {
				select: {
					name: true,
					email: true,
					image: true,
					role: true,
					isBanned: true,
					isDeleted: true,
					createdAt: true,
				},
			},
			category: {
				select: {
					name: true,
					icon: true,
					description: true,
					isDeleted: true,
					createdAt: true,
				},
			},
			votes: {
				select: {
					id: true,
					type: true,
					userId: true,
					createdAt: true,
				},
			},
			comments: {
				select: {
					id: true,
					userId: true,
					content: true,
					createdAt: true,
				},
			},
			payments: {
				select: {
					id: true,
					userId: true,
					amount: true,
					transactionId: true,
					createdAt: true,
				},
			},
		},
	});

	return ideas;
};

const reviewIdea = async (ideaId: string, payload: IReviewIdeaPayload) => {
	const idea = await prisma.idea.findUnique({
		where: {
			id: ideaId,
			isDeleted: false,
		},
	});

	if (!idea) {
		throw new AppError(status.NOT_FOUND, "Idea not found");
	}

	if (idea.status === "DRAFT") {
		throw new AppError(status.BAD_REQUEST, "Idea not ready to review");
	}

	if (idea.status !== "PENDING") {
		throw new AppError(status.BAD_REQUEST, "Idea already reviewed");
	}

	const reviewedIdea = await prisma.idea.update({
		where: {
			id: ideaId,
		},
		data: {
			status: payload.status,
			rejectionFeedback: payload.rejectionFeedback,
			publishedAt: payload.status === "APPROVED" ? new Date() : undefined,
		},
	});

	return reviewedIdea;
};

const deleteIdea = async (ideaId: string) => {
	const idea = await prisma.idea.findUnique({
		where: {
			id: ideaId,
		},
	});

	if (!idea) {
		throw new AppError(status.NOT_FOUND, "Idea not found");
	}

	if (idea.isDeleted) {
		throw new AppError(status.BAD_REQUEST, "Idea already deleted");
	}

	const deletedIdea = await prisma.idea.update({
		where: {
			id: ideaId,
		},
		data: {
			isDeleted: true,
			deletedAt: new Date(),
		},
	});

	return deletedIdea;
};

export const ideaModerationService = {
	getAllIdeas,
	reviewIdea,
	deleteIdea,
};
