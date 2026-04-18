import { IRequestUser } from "./request.types";

declare global {
	namespace Express {
		interface Request {
			user: IRequestUser;
		}
	}
}
