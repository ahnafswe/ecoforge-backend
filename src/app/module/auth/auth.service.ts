import status from "http-status";
import { AppError } from "../../errors/AppError";
import { auth } from "../../lib/auth";
import { ILoginUserPayload, ISignupMemberPayload } from "./auth.types";
import { tokenUtils } from "../../utils/token";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import ms, { StringValue } from "ms";

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

const logoutUser = async (sessionToken: string) => {
	const result = await auth.api.signOut({
		headers: new Headers({
			Authorization: `Bearer ${sessionToken}`,
		}),
	});

	return result;
};

const renewTokens = async (refreshToken: string, sessionToken: string) => {
	const session = await prisma.session.findUnique({
		where: {
			token: sessionToken,
		},
		include: {
			user: true,
		},
	});

	if (!session) {
		throw new AppError(status.UNAUTHORIZED, "Invalid session token");
	}

	const verifiedRefreshToken = jwtUtils.verifyToken(
		refreshToken,
		envVars.REFRESH_TOKEN_SECRET,
	);

	if (!verifiedRefreshToken.success) {
		throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
	}

	const user = verifiedRefreshToken.data as JwtPayload;

	const newAccessToken = tokenUtils.getAccessToken({
		userId: user.userId,
		name: user.name,
		email: user.email,
		role: user.role,
		emailVerified: user.emailVerified,
		isDeleted: user.isDeleted,
	});

	const newRefreshToken = tokenUtils.getRefreshToken({
		userId: user.userId,
		name: user.name,
		email: user.email,
		role: user.role,
		emailVerified: user.emailVerified,
		isDeleted: user.isDeleted,
	});

	const { token: updatedSessionToken } = await prisma.session.update({
		where: {
			token: sessionToken,
		},
		data: {
			expiresAt: new Date(
				Date.now() + ms(envVars.SESSION_TOKEN_EXPIRES_IN as StringValue),
			),
			updatedAt: new Date(),
		},
	});

	return {
		accessToken: newAccessToken,
		refreshToken: newRefreshToken,
		sessionToken: updatedSessionToken,
	};
};

export const authService = {
	signupMember,
	loginUser,
	logoutUser,
	renewTokens,
};
