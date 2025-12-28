"use client";

import { useFormContext } from "react-hook-form";
import { BUSINESS_TYPES, type PrivacyWizardAnswers } from "@/lib/types";

export function BusinessInfoStep() {
  const { register, formState: { errors } } = useFormContext<PrivacyWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
        <p className="mt-1 text-gray-600">Tell us about your business</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-900">
            Business/Website Name *
          </label>
          <input
            type="text"
            id="businessName"
            {...register("businessInfo.businessName", { required: "Business name is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Acme Inc."
          />
          {errors.businessInfo?.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessInfo.businessName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-900">
            Business Type *
          </label>
          <select
            id="businessType"
            {...register("businessInfo.businessType", { required: "Business type is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a type...</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.businessInfo?.businessType && (
            <p className="mt-1 text-sm text-red-600">{errors.businessInfo.businessType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-900">
            Website URL *
          </label>
          <input
            type="url"
            id="websiteUrl"
            {...register("businessInfo.websiteUrl", {
              required: "Website URL is required",
              pattern: {
                value: /^https?:\/\/.+/,
                message: "Please enter a valid URL starting with http:// or https://"
              }
            })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
          {errors.businessInfo?.websiteUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.businessInfo.websiteUrl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-900">
            Privacy Contact Email *
          </label>
          <input
            type="email"
            id="contactEmail"
            {...register("businessInfo.contactEmail", {
              required: "Contact email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address"
              }
            })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="privacy@example.com"
          />
          {errors.businessInfo?.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.businessInfo.contactEmail.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
