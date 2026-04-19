import z from "zod";

export const updateUserStatusSchema = z.object({
	banReason: z
		.string("Ban Reason - optional and string")
		.trim()
		.max(256, "Ban Reason - maximum 256 characters")
		.optional(),
});
