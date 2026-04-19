export interface ICreateIdeaPayload {
	categoryId: string;
	title: string;
	problem: string;
	solution: string;
	description: string;
	thumbnail?: string;
	status?: "DRAFT" | "PENDING";
	isPaid?: boolean;
	price?: number;
}

export interface IGetIdeasQuery {
	page?: number;
	limit?: number;
	search?: string;
	authorId?: string;
	categoryId?: string;
	isPaid?: boolean;
}
