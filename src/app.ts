import express, { Application, Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler.middleware";
import { notFound } from "./app/middlewares/notFound.middleware";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cookieParser from "cookie-parser";

const app: Application = express();

app.all("/api/v1/better-auth/*splat", toNodeHandler(auth));

app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(express.json());

app.use(cookieParser());

// app.use("/api/v1", IndexRouter);

app.get("/", (_req: Request, res: Response) => {
	res.json({
		success: true,
		message: "Welcome to EcoForge server.",
	});
});

app.use(notFound);

app.use(globalErrorHandler);

export { app };
