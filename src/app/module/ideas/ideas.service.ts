import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateIdeaPayload, IGetIdeasQuery, IUpdateIdeaPayload } from "./ideas.types";
import { IdeaOrderByWithRelationInput } from "../../../generated/prisma/models";

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
	const take = queries.limit || 10;

	let orderBy: IdeaOrderByWithRelationInput = { publishedAt: "desc" };

	if (queries.sortBy === "top_voted") {
		orderBy = { upvoteCount: "desc" };
	} else if (queries.sortBy === "most_commented") {
		orderBy = { comments: { _count: "desc" } };
	}

	const ideas = await prisma.idea.findMany({
		where: {
			isDeleted: false,
			status: "APPROVED",
			categoryId: queries.categoryId,
			isPaid: queries.isPaid,
			...(queries.minVotes && {
				upvoteCount: {
					gte: queries.minVotes,
				},
			}),
			...(queries.search && {
				OR: [
					{ title: { contains: queries.search, mode: "insensitive" } },
					{ description: { contains: queries.search, mode: "insensitive" } },
					{ author: { name: { contains: queries.search, mode: "insensitive" } } },
				],
			}),
		},
		skip,
		take,
		orderBy,
		include: {
			_count: {
				select: {
					votes: true,
					comments: true,
				},
			},
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
			payments: {
				select: {
					id: true,
					userId: true,
					amount: true,
					transactionId: true,
					status: true,
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
			_count: {
				select: {
					votes: true,
					comments: true,
				},
			},
			author: true,
			category: true,
			payments: true,
		},
	});

	if (!idea) {
		throw new AppError(status.NOT_FOUND, "Idea not found");
	}

	return idea;
};

const getMyIdeas = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId, isDeleted: false },
	});

	if (!user) {
		throw new AppError(status.NOT_FOUND, "User not found");
	}

	if (user.isBanned) {
		throw new AppError(status.FORBIDDEN, "User is banned");
	}

	const ideas = await prisma.idea.findMany({
		where: {
			authorId: userId,
			isDeleted: false,
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			_count: {
				select: {
					votes: true,
					comments: true,
				},
			},
			category: true,
			payments: true,
		},
	});

	return ideas;
};

const updateIdea = async (ideaId: string, payload: IUpdateIdeaPayload) => {
	const idea = await prisma.idea.findUnique({
		where: {
			id: ideaId,
			isDeleted: false,
			status: {
				in: ["DRAFT", "REJECTED"],
			},
		},
	});

	if (!idea) {
		throw new AppError(status.NOT_FOUND, "Idea not found");
	}

	const updatedIdea = await prisma.idea.update({
		where: {
			id: ideaId,
		},
		data: payload,
	});

	return updatedIdea;
};

const deleteIdea = async (ideaId: string) => {
	const idea = await prisma.idea.findUnique({
		where: {
			id: ideaId,
			status: {
				not: "APPROVED",
			},
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

export const ideasService = {
	createIdea,
	getIdeas,
	getIdeaById,
	getMyIdeas,
	updateIdea,
	deleteIdea,
};
