import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateIdeaPayload, IGetIdeasQuery } from "./ideas.types";

const createIdea = async (authorId: string, payload: ICreateIdeaPayload) => {
	const idea = await prisma.idea.create({
		data: {
			authorId,
			...payload,
		},
	});

	return idea;
};

const getIdeas = async (queries: IGetIdeasQuery) => {
	const skip = queries.page && queries.limit ? (queries.page - 1) * queries.limit : 0;
	const take = queries.limit || 25;

	const ideas = await prisma.idea.findMany({
		where: {
			isDeleted: false,
			status: "APPROVED",
			authorId: queries.authorId,
			categoryId: queries.categoryId,
			isPaid: queries.isPaid,
			...(queries.search && {
				OR: [
					{ title: { contains: queries.search, mode: "insensitive" } },
					{ author: { name: { contains: queries.search, mode: "insensitive" } } },
				],
			}),
		},
		skip,
		take,
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

const getIdeaById = async (ideaId: string) => {
	const idea = await prisma.idea.findUnique({
		where: {
			id: ideaId,
			isDeleted: false,
			status: "APPROVED",
		},
		include: {
			author: true,
			category: true,
			votes: true,
			comments: true,
			payments: true,
		},
	});

	if (!idea) {
		throw new AppError(status.NOT_FOUND, "Idea not found");
	}

	return idea;
};

export const ideasService = {
	createIdea,
	getIdeas,
	getIdeaById,
};
