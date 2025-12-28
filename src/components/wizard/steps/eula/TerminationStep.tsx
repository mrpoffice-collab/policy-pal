"use client";

import { useFormContext } from "react-hook-form";
import { TERMINATION_CONDITIONS, SUPPORT_TERMS, type EulaWizardAnswers } from "@/lib/types";

export function TerminationStep() {
  const { register, formState: { errors } } = useFormContext<EulaWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Termination & Support</h2>
        <p className="mt-1 text-gray-600">When can the license be terminated?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="supportTerms" className="block text-sm font-medium text-gray-900">
            Support Terms *
          </label>
          <select
            id="supportTerms"
            {...register("eulaInfo.supportTerms", { required: "Support terms are required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select support level...</option>
            {SUPPORT_TERMS.map((term) => (
              <option key={term.value} value={term.value}>{term.label}</option>
            ))}
          </select>
          {errors.eulaInfo?.supportTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.eulaInfo.supportTerms.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            License Termination Conditions *
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Under what circumstances can the license be terminated?
          </p>
          <div className="space-y-2">
            {TERMINATION_CONDITIONS.map((condition) => (
              <label
                key={condition}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={condition}
                  {...register("eulaInfo.terminationConditions", { required: "Select at least one" })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{condition}</span>
              </label>
            ))}
          </div>
          {errors.eulaInfo?.terminationConditions && (
            <p className="mt-2 text-sm text-red-600">{errors.eulaInfo.terminationConditions.message}</p>
          )}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-medium text-amber-800 mb-2">Upon Termination</h3>
          <p className="text-sm text-amber-700">
            Your EULA will specify that upon termination, users must cease all use
            of the software and delete all copies. Any data stored locally may be
            lost unless exported before termination.
          </p>
        </div>
      </div>
    </div>
  );
}
