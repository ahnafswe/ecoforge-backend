import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
	NODE_ENV: string;
	PORT: string;
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	ACCESS_TOKEN_SECRET: string;
	REFRESH_TOKEN_SECRET: string;
	ACCESS_TOKEN_EXPIRES_IN: string;
	REFRESH_TOKEN_EXPIRES_IN: string;
	SESSION_TOKEN_EXPIRES_IN: string;
	SESSION_TOKEN_UPDATE_AGE: string;
	DATABASE_URL: string;
}

const loadEnvVars = (): EnvConfig => {
	const requiredEnvVars = [
		"NODE_ENV",
		"PORT",
		"BETTER_AUTH_SECRET",
		"BETTER_AUTH_URL",
		"GOOGLE_CLIENT_ID",
		"GOOGLE_CLIENT_SECRET",
		"ACCESS_TOKEN_SECRET",
		"REFRESH_TOKEN_SECRET",
		"ACCESS_TOKEN_EXPIRES_IN",
		"REFRESH_TOKEN_EXPIRES_IN",
		"SESSION_TOKEN_EXPIRES_IN",
		"SESSION_TOKEN_UPDATE_AGE",
		"DATABASE_URL",
	];
	requiredEnvVars.forEach((envVar) => {
		if (!process.env[envVar]) {
			throw new Error(
				`Environment variable ${envVar} is required but not set in .env file.`,
			);
		}
	});
	return {
		NODE_ENV: process.env.NODE_ENV as string,
		PORT: process.env.PORT as string,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
		ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
		REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
		ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
		REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
		SESSION_TOKEN_EXPIRES_IN: process.env.SESSION_TOKEN_EXPIRES_IN as string,
		SESSION_TOKEN_UPDATE_AGE: process.env.SESSION_TOKEN_UPDATE_AGE as string,
		DATABASE_URL: process.env.DATABASE_URL as string,
	};
};

export const envVars = loadEnvVars();
