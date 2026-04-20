import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comments.types";

const createComment = async (
	userId: string,
	ideaId: string,
	payload: ICreateCommentPayload,
) => {
	const { content } = payload;

	const comment = await prisma.comment.create({
		data: {
			userId,
			ideaId,
			content,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					image: true,
					email: true,
				},
			},
			idea: {
				include: {
					_count: {
						select: {
							votes: true,
							comments: true,
						},
					},
				},
			},
		},
	});

	return comment;
};

const getComments = async (ideaId: string) => {
	const comments = await prisma.comment.findMany({
		where: {
			ideaId,
			isDeleted: false,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return comments;
};

const deleteComment = async (commentId: string) => {
	const comment = await prisma.comment.findUnique({
		where: {
			id: commentId,
		},
	});

	if (!comment) {
		throw new AppError(status.NOT_FOUND, "Comment not found");
	}

	if (comment.isDeleted) {
		throw new AppError(status.BAD_REQUEST, "Comment already deleted");
	}

	const deletedComment = await prisma.comment.update({
		where: {
			id: commentId,
		},
		data: {
			isDeleted: true,
			deletedAt: new Date(),
		},
	});

	return deletedComment;
};

export const commentsService = {
	createComment,
	getComments,
	deleteComment,
};
