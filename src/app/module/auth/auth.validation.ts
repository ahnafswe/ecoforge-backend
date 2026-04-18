import z from "zod";

export const signupMemberSchema = z.object({
	name: z
		.string("Name - required and string")
		.min(1, "Name - minimum 1 character")
		.max(100, "Name - maximum 100 characters"),
	image: z.url("Image - optional and URL").optional(),
	email: z
		.email("Email - required and string")
		.min(5, "Email - minimum 5 characters")
		.max(128, "Email - maximum 128 characters"),
	password: z
		.string("Password - required and string")
		.min(6, "Password - minimum 6 characters")
		.max(128, "Password - maximum 218 characters"),
});

export const loginUserSchema = z.object({
	email: z
		.email("Email - required and string")
		.min(5, "Email - minimum 5 characters")
		.max(128, "Email - maximum 128 characters"),
	password: z
		.string("Password - required and string")
		.min(6, "Password - minimum 6 characters")
		.max(128, "Password - maximum 218 characters"),
});

export const updatePasswordSchema = z.object({
	oldPassword: z
		.string("Old Password - required and string")
		.min(6, "Old Password - minimum 6 characters")
		.max(128, "Old Password - maximum 218 characters"),
	newPassword: z
		.string("New Password - required and string")
		.min(6, "New Password - minimum 6 characters")
		.max(128, "New Password - maximum 218 characters"),
});
