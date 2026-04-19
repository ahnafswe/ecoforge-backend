import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../types/request.types";
import { IUpdateUserStatusPayload } from "./users.types";

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
			_count: {
				select: {
					ideas: true,
					votes: true,
					comments: true,
					payments: true,
				},
			},
		},
	});

	return users;
};

const updateUserRole = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
			isDeleted: false,
		},
	});

	if (!user) {
		throw new AppError(status.NOT_FOUND, "User not found");
	}

	if (user.role === "ADMIN") {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				role: "MEMBER",
			},
		});
	} else {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				role: "ADMIN",
			},
		});
	}

	const updatedUser = await prisma.user.findUnique({ where: { id: userId } });

	return updatedUser;
};

const updateUserStatus = async (userId: string, payload: IUpdateUserStatusPayload) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
			isDeleted: false,
		},
	});

	if (!user) {
		throw new AppError(status.NOT_FOUND, "User not found");
	}

	const updatedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			isBanned: !user.isBanned,
			banReason: payload.banReason,
		},
	});

	return updatedUser;
};

export const usersService = {
	getMe,
	getUsers,
	updateUserRole,
	updateUserStatus,
};
