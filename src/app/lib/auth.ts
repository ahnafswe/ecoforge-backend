import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "./prisma";
import { envVars } from "../config/env";
import { bearer } from "better-auth/plugins";
import ms, { StringValue } from "ms";
import { sendAuthEmail } from "./email";

export const auth = betterAuth({
	appName: "EcoForge",
	baseURL: envVars.BACKEND_URL,
	basePath: "/api/v1/better-auth",
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: false,
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendAuthEmail(user.email, url, "verify");
		},
	},
	socialProviders: {
		google: {
			clientId: envVars.GOOGLE_CLIENT_ID,
			clientSecret: envVars.GOOGLE_CLIENT_SECRET,
		},
	},
	session: {
		expiresIn: ms(envVars.SESSION_TOKEN_EXPIRES_IN as StringValue) / 1000,
		updateAge: ms(envVars.SESSION_TOKEN_UPDATE_AGE as StringValue) / 1000,
		cookieCache: {
			enabled: true,
			maxAge: ms(envVars.SESSION_TOKEN_EXPIRES_IN as StringValue) / 1000,
		},
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				defaultValue: UserRole.MEMBER,
			},
			isBanned: {
				type: "boolean",
				defaultValue: false,
				input: false,
			},
			banReason: {
				type: "string",
				required: false,
			},
			isDeleted: {
				type: "boolean",
				defaultValue: false,
				input: false,
			},
			deletedAt: {
				type: "date",
				required: false,
				input: false,
			},
		},
	},
	plugins: [bearer()],
});
