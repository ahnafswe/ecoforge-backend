import status from "http-status";
import { AppError } from "../../errors/AppError";
import { auth } from "../../lib/auth";
import { ILoginUserPayload, ISignupMemberPayload, IUpdatePasswordPayload } from "./auth.types";
import { UserRole } from "../../../generated/prisma/enums";

const signupMember = async (payload: ISignupMemberPayload) => {
	const { name, image, email, password } = payload;

	const userData = await auth.api.signUpEmail({
		body: {
			name,
			...(image && { image }),
			email,
			password,
			role: UserRole.MEMBER,
		},
	});
	const user = userData.user;

	if (!user) {
		throw new AppError(status.BAD_REQUEST, "Unable to signup member");
	}

	return userData;
};

const loginUser = async (payload: ILoginUserPayload) => {
	const { email, password } = payload;

	const data = await auth.api.signInEmail({
		body: {
			email,
			password,
		},
	});

	if (data.user.isDeleted) {
		throw new AppError(status.NOT_FOUND, "Unable to login user because user is deleted.");
	}

	if (data.user.isBanned) {
		throw new AppError(status.FORBIDDEN, "Unable to login user because user is banned.");
	}

	return data;
};

const logoutUser = async () => {
	const result = await auth.api.signOut();

	return result;
};

const updatePassword = async (payload: IUpdatePasswordPayload) => {
	const session = await auth.api.getSession();

	if (!session) {
		throw new AppError(status.UNAUTHORIZED, "Invalid session token");
	}

	const { oldPassword, newPassword } = payload;

	const result = await auth.api.changePassword({
		body: {
			currentPassword: oldPassword,
			newPassword,
			revokeOtherSessions: true,
		},
	});

	return result;
};

export const authService = {
	signupMember,
	loginUser,
	logoutUser,
	updatePassword,
};
