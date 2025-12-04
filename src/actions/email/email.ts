"use server";

import nodemailer from "nodemailer";

export async function sendRegistrationEmail({ name, email, memorableId }: { name: string; email: string; memorableId: string }) {
	console.log("Preparing to send registration email to:", email);
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("Missing SMTP environment variables");
        throw new Error("SMTP configuration is incomplete");
    }
    const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: Number(process.env.SMTP_PORT) === 465,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	const mailOptions = {
		from: process.env.SMTP_USER,
		to: email,
		subject: `Welcome to the Mentorship Program! Your Memorable ID`,
		html: `
			<div style="background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%); border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); padding: 32px; font-family: 'Segoe UI', 'Roboto', Arial, sans-serif; color: #222; max-width: 500px; margin: auto;">
				<h1 style="color: #6366f1; margin-bottom: 12px;">Welcome, ${name}!</h1>
				<p style="font-size: 1.1em; margin-bottom: 18px;">Thank you for registering for our Mentorship Program. We're excited to have you join our community of learners and mentors!</p>
				<div style="background: #fff; border-radius: 8px; padding: 18px 24px; box-shadow: 0 2px 8px rgba(99,102,241,0.08); margin-bottom: 18px;">
					<h2 style="color: #10b981; margin: 0 0 8px 0;">Your Memorable ID</h2>
					<div style="font-size: 2em; font-weight: bold; letter-spacing: 0.2em; color: #6366f1;">${memorableId}</div>
					<p style="margin-top: 8px; color: #64748b;">Please keep this ID safe. You will need it for upgrades and special access in the program.</p>
				</div>
				<p style="margin-bottom: 0;">If you have any questions, feel free to reply to this email. We're here to help you succeed!</p>
				<hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
				<p style="font-size: 0.95em; color: #94a3b8; text-align: center;">Mentorship Program &mdash; Empowering Growth Together</p>
			</div>
		`,
	};

	await transporter.sendMail(mailOptions);
}
