import { UserRole } from "../../generated/prisma/enums";

export interface IRequestUser {
	id: string;
	role: UserRole;
}
