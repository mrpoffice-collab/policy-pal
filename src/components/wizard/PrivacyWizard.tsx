"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ArrowLeft, ArrowRight, Loader2, FileText } from "lucide-react";
import { WizardProgress } from "./WizardProgress";
import { BusinessInfoStep } from "./steps/BusinessInfoStep";
import { GeographicScopeStep } from "./steps/GeographicScopeStep";
import { DataCollectionStep } from "./steps/DataCollectionStep";
import { DataUseStep } from "./steps/DataUseStep";
import { ThirdPartyStep } from "./steps/ThirdPartyStep";
import { UserRightsStep } from "./steps/UserRightsStep";
import { SecurityStep } from "./steps/SecurityStep";
import { PRIVACY_WIZARD_STEPS, type PrivacyWizardAnswers } from "@/lib/types";

interface PrivacyWizardProps {
  onComplete: (answers: PrivacyWizardAnswers) => void;
  isGenerating: boolean;
}

const defaultValues: PrivacyWizardAnswers = {
  businessInfo: {
    businessName: "",
    businessType: "",
    websiteUrl: "",
    contactEmail: "",
  },
  geographicScope: {
    hasEUUsers: false,
    hasCAUsers: false,
    businessLocation: "",
  },
  dataCollection: {
    dataTypes: [],
    collectionMethods: [],
    collectsChildrenData: false,
    collectsSensitiveData: false,
    retentionPeriod: "",
  },
  dataUse: {
    purposes: [],
    automatedDecisionMaking: false,
    sellsData: false,
  },
  thirdPartyServices: {
    services: [],
    otherThirdParties: "",
  },
  userRights: {
    requestMethod: "",
    responseTime: "",
  },
  securityMeasures: {
    measures: [],
    hadBreach: false,
  },
};

export function PrivacyWizard({ onComplete, isGenerating }: PrivacyWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<PrivacyWizardAnswers>({
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, trigger } = methods;

  const steps = [
    <BusinessInfoStep key="business" />,
    <GeographicScopeStep key="geographic" />,
    <DataCollectionStep key="collection" />,
    <DataUseStep key="use" />,
    <ThirdPartyStep key="thirdparty" />,
    <UserRightsStep key="rights" />,
    <SecurityStep key="security" />,
  ];

  const stepFields: (keyof PrivacyWizardAnswers)[] = [
    "businessInfo",
    "geographicScope",
    "dataCollection",
    "dataUse",
    "thirdPartyServices",
    "userRights",
    "securityMeasures",
  ];

  const handleNext = async () => {
    const isValid = await trigger(stepFields[currentStep]);
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: PrivacyWizardAnswers) => {
    onComplete(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
        <WizardProgress steps={PRIVACY_WIZARD_STEPS} currentStep={currentStep} />

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {steps[currentStep]}

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

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Policy
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
