import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "./prisma";
import { envVars } from "../config/env";

export const auth = betterAuth({
	appName: "EcoForge",
	basePath: "/api/v1/better-auth",
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		minPasswordLength: 6,
		requireEmailVerification: false,
	},
	emailVerification: {
		sendOnSignUp: true,
	},
	socialProviders: {
		google: {
			clientId: envVars.GOOGLE_CLIENT_ID,
			clientSecret: envVars.GOOGLE_CLIENT_SECRET,
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
});
