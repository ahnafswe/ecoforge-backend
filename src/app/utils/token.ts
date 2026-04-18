import { Response } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import ms, { StringValue } from "ms";
import { envVars } from "../config/env";
import { cookieUtils } from "./cookie";

const getAccessToken = (payload: JwtPayload) => {
	const accessToken = jwt.sign(payload, envVars.ACCESS_TOKEN_SECRET, {
		expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN,
	} as SignOptions);

	return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
	const refreshToken = jwt.sign(payload, envVars.REFRESH_TOKEN_SECRET, {
		expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN,
	} as SignOptions);

	return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
	const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue);

	cookieUtils.setCookie(res, "access_token", token, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
		maxAge,
	});
};

const setRefreshTokenCookie = (res: Response, token: string) => {
	const maxAge = ms(envVars.REFRESH_TOKEN_EXPIRES_IN as StringValue);

	cookieUtils.setCookie(res, "refresh_token", token, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
		maxAge,
	});
};

const setSessionTokenCookie = (res: Response, token: string) => {
	const maxAge = ms(envVars.SESSION_TOKEN_EXPIRES_IN as StringValue);

	cookieUtils.setCookie(res, "better-auth.session_token", token, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
		maxAge,
	});
};

const clearTokenCookies = (res: Response) => {
	cookieUtils.clearCookie(res, "access_token", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});
	cookieUtils.clearCookie(res, "refresh_token", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});
	cookieUtils.clearCookie(res, "better-auth.session_token", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});
};

export const tokenUtils = {
	getAccessToken,
	getRefreshToken,
	setAccessTokenCookie,
	setRefreshTokenCookie,
	setSessionTokenCookie,
	clearTokenCookies,
};
