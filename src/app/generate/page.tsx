"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, FileText, Scale, Cookie } from "lucide-react";
import { PrivacyWizard } from "@/components/wizard/PrivacyWizard";
import { TermsWizard } from "@/components/wizard/TermsWizard";
import { EulaWizard } from "@/components/wizard/EulaWizard";
import { CookieWizard } from "@/components/wizard/CookieWizard";
import { PolicyPreview } from "@/components/PolicyPreview";
import type { PrivacyWizardAnswers, PolicyType } from "@/lib/types";

type GenerationState = "select" | "wizard" | "generating" | "preview";

export default function GeneratePage() {
  const [state, setState] = useState<GenerationState>("select");
  const [policyType, setPolicyType] = useState<PolicyType>("privacy");
  const [generatedPolicy, setGeneratedPolicy] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectType = (type: PolicyType) => {
    setPolicyType(type);
    setState("wizard");
  };

  const handleWizardComplete = async (answers: PrivacyWizardAnswers) => {
    setIsGenerating(true);
    setBusinessName(answers.businessInfo.businessName);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: policyType, answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate policy");
      }

      const data = await response.json();
      setGeneratedPolicy(data.content);
      setState("preview");
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate policy. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (state === "wizard") {
      setState("select");
    } else if (state === "preview") {
      setState("wizard");
    }
  };

  const policyTypes = [
    {
      type: "privacy" as PolicyType,
      icon: FileText,
      title: "Privacy Policy",
      description: "GDPR & CCPA compliant privacy policy for your website or app",
    },
    {
      type: "terms" as PolicyType,
      icon: Scale,
      title: "Terms of Service",
      description: "Legal terms and conditions to protect your business",
    },
    {
      type: "eula" as PolicyType,
      icon: Shield,
      title: "EULA",
      description: "End User License Agreement for software products",
    },
    {
      type: "cookies" as PolicyType,
      icon: Cookie,
      title: "Cookie Policy",
      description: "Cookie policy with embeddable consent banner",
    },
  ];

  const getPolicyTypeName = (type: PolicyType): string => {
    const names: Record<PolicyType, string> = {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      eula: "EULA",
      cookies: "Cookie Policy",
    };
    return names[type];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PolicyPal</span>
            </Link>
            {state !== "select" && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {state === "select" && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                What would you like to generate?
              </h1>
              <p className="text-lg text-gray-600">
                Select the type of legal document you need. Our AI will guide you
                through a few questions to customize it for your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {policyTypes.map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleSelectType(item.type)}
                  className="flex flex-col items-start p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left"
                >
                  <item.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {state === "wizard" && policyType === "privacy" && (
          <PrivacyWizard
            onComplete={handleWizardComplete}
            isGenerating={isGenerating}
          />
        )}

        {state === "wizard" && policyType === "terms" && (
          <TermsWizard
            onComplete={handleWizardComplete}
            isGenerating={isGenerating}
          />
        )}

        {state === "wizard" && policyType === "eula" && (
          <EulaWizard
            onComplete={handleWizardComplete}
            isGenerating={isGenerating}
          />
        )}

        {state === "wizard" && policyType === "cookies" && (
          <CookieWizard
            onComplete={handleWizardComplete}
            isGenerating={isGenerating}
          />
        )}

        {state === "preview" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Your {getPolicyTypeName(policyType)} is Ready!
              </h1>
              <p className="text-gray-600">
                Review your generated policy below. You can copy it, download it,
                or save it to your account.
              </p>
            </div>

            <PolicyPreview
              content={generatedPolicy}
              policyType={getPolicyTypeName(policyType)}
              businessName={businessName}
            />

            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Disclaimer:</strong> This policy is generated as a template
                and starting point only. It does not constitute legal advice. We
                recommend having your policies reviewed by a qualified attorney.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setState("select")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Generate Another
              </button>
              <Link
                href="/signup"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save to Account
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
