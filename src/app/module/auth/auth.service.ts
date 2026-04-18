import status from "http-status";
import { AppError } from "../../errors/AppError";
import { auth } from "../../lib/auth";
import { ILoginUserPayload, ISignupMemberPayload } from "./auth.types";
import { tokenUtils } from "../../utils/token";
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

	const accessToken = tokenUtils.getAccessToken({
		userId: data.user.id,
		name: data.user.name,
		email: data.user.email,
		role: data.user.role,
		emailVerified: data.user.emailVerified,
		isDeleted: data.user.isDeleted,
	});
	const refreshToken = tokenUtils.getRefreshToken({
		userId: data.user.id,
		name: data.user.name,
		email: data.user.email,
		role: data.user.role,
		emailVerified: data.user.emailVerified,
		isDeleted: data.user.isDeleted,
	});

	return { accessToken, refreshToken, ...data };
};

export const authService = {
	signupMember,
	loginUser,
};
