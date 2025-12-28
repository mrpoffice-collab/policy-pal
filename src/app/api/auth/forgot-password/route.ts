import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If an account exists, we've sent reset instructions" });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: `reset:${email}`,
          token: token,
        },
      },
      update: {
        token,
        expires,
      },
      create: {
        identifier: `reset:${email}`,
        token,
        expires,
      },
    });

    // TODO: Send email with reset link
    // For now, we'll just log the token in development
    console.log(`Password reset token for ${email}: ${token}`);

    return NextResponse.json({ message: "If an account exists, we've sent reset instructions" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
