"use server";

import { verifyRefreshToken, generateTokens } from "../../lib/auth";

export async function refreshAccessTokenAction(refreshToken: string): Promise<
  | { success: true; accessToken: string; refreshToken: string; role: string }
  | { success: false; error: string }
> {
  try {
    if (!refreshToken) {
      return { success: false, error: "Refresh token required" };
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return { success: false, error: "Invalid or expired refresh token" };
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    return {
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      role: payload.role,
    };
  } catch (err) {
    console.error("Refresh token error:", err);
    return { success: false, error: "Token refresh failed" };
  }
}
