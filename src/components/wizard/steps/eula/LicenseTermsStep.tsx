"use client";

import { useFormContext } from "react-hook-form";
import { LICENSE_TYPES, SOURCE_CODE_OPTIONS, type EulaWizardAnswers } from "@/lib/types";

export function LicenseTermsStep() {
  const { register, formState: { errors } } = useFormContext<EulaWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">License Terms</h2>
        <p className="mt-1 text-gray-600">Define the terms of your software license</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="licenseType" className="block text-sm font-medium text-gray-900">
            License Type *
          </label>
          <select
            id="licenseType"
            {...register("eulaInfo.licenseType", { required: "License type is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a type...</option>
            {LICENSE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.eulaInfo?.licenseType && (
            <p className="mt-1 text-sm text-red-600">{errors.eulaInfo.licenseType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="sourceCodeAccess" className="block text-sm font-medium text-gray-900">
            Source Code Access *
          </label>
          <select
            id="sourceCodeAccess"
            {...register("eulaInfo.sourceCodeAccess", { required: "Source code access is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option...</option>
            {SOURCE_CODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.eulaInfo?.sourceCodeAccess && (
            <p className="mt-1 text-sm text-red-600">{errors.eulaInfo.sourceCodeAccess.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("eulaInfo.canRedistribute")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Users can redistribute the software</span>
              <p className="mt-1 text-sm text-gray-600">
                Allow users to share or resell the software
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Standard License Restrictions</h3>
          <p className="text-sm text-gray-600 mb-2">
            Your EULA will automatically include restrictions on:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>- Reverse engineering and decompilation</li>
            <li>- Removing copyright notices</li>
            <li>- Using for competing products</li>
            <li>- Transferring without permission</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
