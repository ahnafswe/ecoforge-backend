import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../types/request.types";

const getMe = async (reqUser: IRequestUser) => {
	const user = await prisma.user.findUnique({
		where: {
			id: reqUser.id,
			role: reqUser.role,
			isDeleted: false,
		},
		include: {
			ideas: {
				include: {
					category: {
						select: { icon: true, name: true, description: true },
					},
					comments: {
						include: {
							user: true,
							parent: true,
							replies: true,
						},
					},
					votes: {
						include: {
							user: true,
						},
					},
					payments: {
						include: { user: true },
					},
				},
			},
			comments: {
				include: {
					idea: true,
					parent: true,
					replies: true,
				},
			},
			votes: {
				include: {
					idea: true,
				},
			},
			payments: {
				include: {
					idea: true,
				},
			},
		},
	});

	if (!user) {
		throw new AppError(status.NOT_FOUND, "User not found");
	}

	return user;
};

const getUsers = async () => {
	const users = await prisma.user.findMany({
		where: {
			isDeleted: true,
		},
		include: {
			ideas: {
				include: {
					category: true,
				},
			},
			comments: {
				include: {
					idea: true,
				},
			},
			votes: {
				include: {
					idea: true,
				},
			},
			payments: {
				include: {
					idea: true,
				},
			},
		},
	});

	return users;
};

export const usersService = {
	getMe,
	getUsers,
};
