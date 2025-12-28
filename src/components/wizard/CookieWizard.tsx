"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { WizardProgress } from "./WizardProgress";
import { BusinessInfoStep } from "./steps/BusinessInfoStep";
import { GeographicScopeStep } from "./steps/GeographicScopeStep";
import { CookieTypesStep } from "./steps/cookies/CookieTypesStep";
import { ConsentStep } from "./steps/cookies/ConsentStep";
import { BannerDesignStep } from "./steps/cookies/BannerDesignStep";
import { COOKIE_WIZARD_STEPS, type CookieWizardAnswers, type PrivacyWizardAnswers } from "@/lib/types";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface CookieWizardProps {
  onComplete: (answers: PrivacyWizardAnswers) => void;
  isGenerating?: boolean;
}

export function CookieWizard({ onComplete, isGenerating }: CookieWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<CookieWizardAnswers>({
    defaultValues: {
      businessInfo: { businessName: "", businessType: "", websiteUrl: "", contactEmail: "" },
      geographicScope: { hasEUUsers: false, hasCAUsers: false, businessLocation: "" },
      cookieInfo: {
        cookieTypes: [],
        cookieDetails: [],
        usesThirdPartyCookies: false,
        consentMechanism: "",
      },
      dataCollection: { dataTypes: [], collectionMethods: [], collectsChildrenData: false, collectsSensitiveData: false, retentionPeriod: "" },
      dataUse: { purposes: [], automatedDecisionMaking: false, sellsData: false },
      thirdPartyServices: { services: [], otherThirdParties: "" },
      userRights: { requestMethod: "", responseTime: "" },
      securityMeasures: { measures: [], hadBreach: false },
    },
  });

  const steps = [
    { component: BusinessInfoStep, fields: ["businessInfo"] },
    { component: GeographicScopeStep, fields: ["geographicScope.businessLocation"] },
    { component: CookieTypesStep, fields: ["cookieInfo.cookieTypes"] },
    { component: ConsentStep, fields: ["cookieInfo.consentMechanism"] },
    { component: BannerDesignStep, fields: [] },
  ];

  const handleNext = async () => {
    const currentFields = steps[currentStep].fields;
    const isValid = currentFields.length === 0 || await methods.trigger(currentFields as never[]);
    if (isValid) {
      if (currentStep === steps.length - 1) {
        onComplete(methods.getValues() as unknown as PrivacyWizardAnswers);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const StepComponent = steps[currentStep].component;

  return (
    <FormProvider {...methods}>
      <div className="max-w-3xl mx-auto">
        <WizardProgress steps={COOKIE_WIZARD_STEPS} currentStep={currentStep} />

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <StepComponent />

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : currentStep === steps.length - 1 ? (
                "Generate Cookie Policy"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
