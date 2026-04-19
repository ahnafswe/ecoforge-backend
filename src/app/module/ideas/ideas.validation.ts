import z from "zod";

export const createIdeaSchema = z.object({
	categoryId: z.cuid2("Category ID - required and CUID"),
	title: z
		.string("Title - required and string")
		.trim()
		.min(5, "Title - minimum 5 characters")
		.max(100, "Title - maximum 100 characters"),
	thumbnail: z.url("Thumbnail - optional and URL").optional(),
	problem: z
		.string("Problem - required and string")
		.trim()
		.min(32, "Problem - minimum 32 characters")
		.max(1000, "Problem - maximum 1000 characters"),
	solution: z
		.string("Solution - required and string")
		.trim()
		.min(32, "Solution - minimum 32 characters")
		.max(1000, "Solution - maximum 1000 characters"),
	description: z
		.string("Description - required and string")
		.trim()
		.min(96, "Description - minimum 96 characters")
		.max(4096, "Description - maximum 4096 characters"),
	status: z.enum(["DRAFT", "PENDING"]).default("DRAFT"),
	isPaid: z.boolean().default(false),
	price: z.number().positive().optional(),
});

export const getIdeasQuerySchema = z.object({
	page: z.coerce.number().positive().optional(),
	limit: z.coerce.number().positive().optional(),
	search: z.string().optional(),
	authorId: z.string().optional(),
	categoryId: z.string().optional(),
	isPaid: z
		.enum(["true", "false"])
		.transform((val) => val === "true")
		.optional(),
});
