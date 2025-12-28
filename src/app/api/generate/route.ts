import { NextRequest, NextResponse } from "next/server";
import { generatePrivacyPolicy, generateTermsOfService, generateEula, generateCookiePolicy } from "@/lib/generate-policy";
import type { PrivacyWizardAnswers, TermsWizardAnswers, EulaWizardAnswers, CookieWizardAnswers, PolicyType, Language } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, answers, language = "en" } = body as {
      type: PolicyType;
      answers: PrivacyWizardAnswers | TermsWizardAnswers | EulaWizardAnswers | CookieWizardAnswers;
      language?: Language;
    };

    if (!type || !answers) {
      return NextResponse.json(
        { error: "Missing required fields: type and answers" },
        { status: 400 }
      );
    }

    let content: string;

    switch (type) {
      case "privacy":
        content = await generatePrivacyPolicy(answers as PrivacyWizardAnswers, language);
        break;
      case "terms":
        content = await generateTermsOfService(answers as TermsWizardAnswers, language);
        break;
      case "eula":
        content = await generateEula(answers as EulaWizardAnswers, language);
        break;
      case "cookies":
        content = await generateCookiePolicy(answers as CookieWizardAnswers, language);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid policy type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ content, type, language });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate policy" },
      { status: 500 }
    );
  }
}
