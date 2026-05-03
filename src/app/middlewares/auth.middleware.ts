import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import { AppError } from "../errors/AppError";
import status from "http-status";
import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const auth =
	(...roles: UserRole[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const sessionToken: string | undefined =
				cookieUtils.getCookie(req, "session_token") ||
				cookieUtils.getCookie(req, "__Secure-session_token");

			if (sessionToken) {
				const splitSessionToken = sessionToken?.split(".")[0];

				const session = await prisma.session.findFirst({
					where: {
						token: splitSessionToken,
						expiresAt: {
							gt: new Date(),
						},
					},
					include: {
						user: true,
					},
				});

				if (session && session.user) {
					const user = session.user;

					const now = new Date();
					const createdAt = new Date(session.createdAt);
					const expiresAt = new Date(session.expiresAt);

					const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
					const sessionTimeLeft = expiresAt.getTime() - now.getTime();
					const sessionTimeLeftPercentage = Number(
						((sessionTimeLeft / sessionLifetime) * 100).toFixed(1),
					);

					if (user.isBanned) {
						throw new AppError(
							status.UNAUTHORIZED,
							"Unauthorized access. User is banned.",
						);
					}

					if (user.isDeleted) {
						throw new AppError(
							status.UNAUTHORIZED,
							"Unauthorized access. User is deleted.",
						);
					}

					if (sessionTimeLeftPercentage < 20) {
						res.setHeader("X-Session-Refresh", "true");
						res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
						res.setHeader("X-Session-Time-Remaining", sessionTimeLeft.toString());
					}

					if (roles.length > 0 && !roles.includes(user.role)) {
						throw new AppError(
							status.FORBIDDEN,
							"Forbidden access. You do not have permission to access this resource.",
						);
					}

					req.user = {
						id: user.id,
						role: user.role,
					};
				}
			} else {
				throw new AppError(
					status.UNAUTHORIZED,
					"Unauthorized access. No session token.",
				);
			}

			next();
		} catch (err) {
			next(err);
		}
	};
