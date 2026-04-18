export interface ISignupMemberPayload {
	name: string;
	image?: string;
	email: string;
	password: string;
}

export interface ILoginUserPayload {
	email: string;
	password: string;
}

export interface IUpdatePasswordPayload {
	oldPassword: string;
	newPassword: string;
}
