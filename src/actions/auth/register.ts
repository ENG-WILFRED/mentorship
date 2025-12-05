"use server";

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {sendRegistrationEmail} from "../email/email";

const prisma = new PrismaClient();

function generateMemorableId() {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let id = '';
	for (let i = 0; i < 4; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return id;
}

export async function registerUser({ firstName, lastName, email, description, password }: {
	firstName: string;
	lastName: string;
	email: string;
	description: string;
	password: string;
}): Promise<{ success: boolean; user?: Record<string, unknown>; memorableId?: string; error?: string }> {
	const hashedPassword = await bcrypt.hash(password, 10);
	const memorableId = generateMemorableId();
	try {
		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				password: hashedPassword,
				memorableId,
				feedbacks: {
					create: [{ message: description }]
				},
				mentor: undefined,
				// phone can be stored in bio or a custom field if needed
			}
		});

		// Send registration email with memorable ID
		try {
            console.log("Preparing to send registration email to:", email);
			await sendRegistrationEmail({ name: `${firstName} ${lastName}`, email, memorableId });
		} catch (emailError) {
			// Log but don't fail registration if email fails
			console.error("Failed to send registration email:", emailError);
		}

		return { success: true, user, memorableId };
	} catch (error) {
		return { success: false, error: error instanceof Error ? error.message : String(error) };
	}
}
