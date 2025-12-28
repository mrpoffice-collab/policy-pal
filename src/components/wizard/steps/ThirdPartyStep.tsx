"use client";

import { useFormContext } from "react-hook-form";
import { THIRD_PARTY_SERVICES, type PrivacyWizardAnswers } from "@/lib/types";

export function ThirdPartyStep() {
  const { register } = useFormContext<PrivacyWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
        <p className="mt-1 text-gray-600">What third-party services does your business use?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Which services do you use?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Select all third-party services that may process user data. Each will be specifically
            mentioned in your privacy policy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {THIRD_PARTY_SERVICES.map((service) => (
              <label
                key={service}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={service}
                  {...register("thirdPartyServices.services")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="otherThirdParties" className="block text-sm font-medium text-gray-900">
            Other third parties
          </label>
          <p className="text-sm text-gray-600 mb-2">
            List any other services or partners you share data with (optional)
          </p>
          <textarea
            id="otherThirdParties"
            {...register("thirdPartyServices.otherThirdParties")}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., CRM providers, email marketing tools, business partners..."
          />
        </div>
      </div>
    </div>
  );
}
