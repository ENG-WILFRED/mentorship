"use server";

import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { generateTokens } from "../../lib/auth";

function generateMemorableId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

interface RegisterResponse {
  success: boolean;
  error?: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    memorableId: string;
  };
  accessToken?: string;
  refreshToken?: string;
  role?: string;
}

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    if (!firstName || !lastName || !email || !password) {
      return { success: false, error: "Missing required fields" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const memorableId = generateMemorableId();

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        memorableId,
        role: "GUEST",
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        memorableId: user.memorableId,
      },
      accessToken,
      refreshToken,
      role: user.role,
    };
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, error: "Registration failed" };
  }
}
