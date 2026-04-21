import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
	NODE_ENV: string;
	PORT: string;
	FRONTEND_URL: string;
	BACKEND_URL: string;
	BETTER_AUTH_SECRET: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	ACCESS_TOKEN_SECRET: string;
	REFRESH_TOKEN_SECRET: string;
	ACCESS_TOKEN_EXPIRES_IN: string;
	REFRESH_TOKEN_EXPIRES_IN: string;
	SESSION_TOKEN_EXPIRES_IN: string;
	SESSION_TOKEN_UPDATE_AGE: string;
	STORE_ID: string;
	STORE_PASSWORD: string;
	IS_LIVE: string;
	DATABASE_URL: string;
}

const loadEnvVars = (): EnvConfig => {
	const requiredEnvVars = [
		"NODE_ENV",
		"PORT",
		"FRONTEND_URL",
		"BACKEND_URL",
		"BETTER_AUTH_SECRET",
		"GOOGLE_CLIENT_ID",
		"GOOGLE_CLIENT_SECRET",
		"ACCESS_TOKEN_SECRET",
		"REFRESH_TOKEN_SECRET",
		"ACCESS_TOKEN_EXPIRES_IN",
		"REFRESH_TOKEN_EXPIRES_IN",
		"SESSION_TOKEN_EXPIRES_IN",
		"SESSION_TOKEN_UPDATE_AGE",
		"STORE_ID",
		"STORE_PASSWORD",
		"IS_LIVE",
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
		FRONTEND_URL: process.env.FRONTEND_URL as string,
		BACKEND_URL: process.env.BACKEND_URL as string,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
		ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
		REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
		ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
		REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
		SESSION_TOKEN_EXPIRES_IN: process.env.SESSION_TOKEN_EXPIRES_IN as string,
		SESSION_TOKEN_UPDATE_AGE: process.env.SESSION_TOKEN_UPDATE_AGE as string,
		STORE_ID: process.env.STORE_ID as string,
		STORE_PASSWORD: process.env.STORE_PASSWORD as string,
		IS_LIVE: process.env.IS_LIVE as string,
		DATABASE_URL: process.env.DATABASE_URL as string,
	};
};

export const envVars = loadEnvVars();
