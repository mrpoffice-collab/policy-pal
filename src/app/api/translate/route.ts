import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

// Translate a policy
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { policyId, targetLanguage } = body;

    if (!policyId || !targetLanguage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get policy
    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
      include: { org: true },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Verify access
    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: session.user.id,
          orgId: policy.orgId,
        },
      },
    });

    if (!membership && policy.org.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if translation already exists
    const existing = await prisma.policyTranslation.findUnique({
      where: {
        policyId_language: {
          policyId,
          language: targetLanguage,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        translation: existing,
        cached: true,
      });
    }

    const languageNames: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      pt: "Portuguese",
      it: "Italian",
      nl: "Dutch",
      pl: "Polish",
    };

    // Translate with Claude
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: `Translate the following legal policy document to ${languageNames[targetLanguage] || targetLanguage}.

Maintain all formatting (headings with #, ##, ###, bullet points with -).
Maintain the same professional legal tone.
Ensure legal terms are accurately translated for the target jurisdiction.

Document to translate:
${policy.content}`,
        },
      ],
    });

    const translatedContent = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    // Save translation
    const translation = await prisma.policyTranslation.create({
      data: {
        policyId,
        language: targetLanguage,
        content: translatedContent,
      },
    });

    return NextResponse.json({
      translation,
      cached: false,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Failed to translate" }, { status: 500 });
  }
}

// Get translations for a policy
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const policyId = searchParams.get("policyId");

    if (!policyId) {
      return NextResponse.json({ error: "Missing policyId" }, { status: 400 });
    }

    const translations = await prisma.policyTranslation.findMany({
      where: { policyId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ translations });
  } catch (error) {
    console.error("Get translations error:", error);
    return NextResponse.json({ error: "Failed to get translations" }, { status: 500 });
  }
}
