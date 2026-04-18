import status from "http-status";
import { AppError } from "../../errors/AppError";
import { auth } from "../../lib/auth";
import { ISignupMemberPayload } from "./auth.types";

const signupMember = async (payload: ISignupMemberPayload) => {
	const { name, image, email, password } = payload;

	const userData = await auth.api.signUpEmail({
		body: {
			name,
			image,
			email,
			password,
		},
	});
	const user = userData.user;

	if (!user) {
		throw new AppError(status.BAD_REQUEST, "Unable to signup member");
	}

	return userData;
};

export const authService = {
	signupMember,
};
