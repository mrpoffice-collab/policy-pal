"use client";

import { useFormContext } from "react-hook-form";
import { DISPUTE_RESOLUTIONS, type TermsWizardAnswers } from "@/lib/types";

export function LiabilityStep() {
  const { register, formState: { errors } } = useFormContext<TermsWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Liability & Disputes</h2>
        <p className="mt-1 text-gray-600">How will disputes be handled?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="disputeResolution" className="block text-sm font-medium text-gray-900">
            Dispute Resolution Method *
          </label>
          <p className="text-sm text-gray-600 mb-2">
            How should disputes between you and users be resolved?
          </p>
          <select
            id="disputeResolution"
            {...register("serviceInfo.disputeResolution", { required: "Select a dispute resolution method" })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a method...</option>
            {DISPUTE_RESOLUTIONS.map((method) => (
              <option key={method.value} value={method.value}>{method.label}</option>
            ))}
          </select>
          {errors.serviceInfo?.disputeResolution && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceInfo.disputeResolution.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="governingLaw" className="block text-sm font-medium text-gray-900">
            Governing Law *
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Which jurisdiction&apos;s laws will govern your Terms of Service?
          </p>
          <input
            type="text"
            id="governingLaw"
            {...register("serviceInfo.governingLaw", { required: "Governing law is required" })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., State of Delaware, USA or England and Wales"
          />
          {errors.serviceInfo?.governingLaw && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceInfo.governingLaw.message}</p>
          )}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Standard Limitations</h3>
          <p className="text-sm text-blue-700 mb-2">
            Your Terms of Service will include these standard clauses:
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>- Service provided &quot;as is&quot; without warranties</li>
            <li>- Limitation of liability to amount paid (if applicable)</li>
            <li>- Disclaimer for indirect/consequential damages</li>
            <li>- Force majeure clause</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
