"use server";

import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { generateTokens } from "../../lib/auth";

interface LoginResponse {
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

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    if (!email || !password) {
      return { success: false, error: "Email and password required" };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" };
    }

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
    console.error("Login error:", err);
    return { success: false, error: "Login failed" };
  }
}
