import nodemailer from "nodemailer";
import { envVars } from "../config/env";

export const transporter = nodemailer.createTransport({
	host: envVars.SMTP_HOST || "smtp.gmail.com",
	port: Number(envVars.SMTP_PORT) || 587,
	secure: Number(envVars.SMTP_PORT) === 465,
	auth: {
		user: envVars.SMTP_USER,
		pass: envVars.SMTP_PASS,
	},
});

export const sendAuthEmail = async (to: string, url: string, type: "verify" | "reset") => {
	const subject = type === "verify" ? "Verify your account" : "Reset your password";
	const buttonText = type === "verify" ? "Verify Email" : "Reset Password";

	const mailOptions = {
		from: `"EcoForge" <${envVars.SMTP_USER}>`,
		to,
		subject,
		html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333;">Welcome to EcoForge!</h2>
                <p style="color: #555; line-height: 1.5;">Please click the button below to ${buttonText.toLowerCase()}.</p>
                <a href="${url}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px; font-weight: bold;">
                    ${buttonText}
                </a>
                <p style="margin-top: 30px; font-size: 12px; color: #999;">
                    If the button doesn't work, copy and paste this link into your browser:<br/>
                    <a href="${url}" style="color: #16a34a;">${url}</a>
                </p>
            </div>
        `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log(`[EMAIL] Successfully sent ${type} email to ${to}`);
	} catch (error) {
		console.error("[EMAIL ERROR] Failed to send email:", error);
	}
};
