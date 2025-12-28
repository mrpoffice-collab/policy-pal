"use client";

import { useFormContext } from "react-hook-form";
import { SOFTWARE_TYPES, type EulaWizardAnswers } from "@/lib/types";

export function SoftwareDetailsStep() {
  const { register, formState: { errors } } = useFormContext<EulaWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Software Details</h2>
        <p className="mt-1 text-gray-600">Tell us about your software</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="softwareName" className="block text-sm font-medium text-gray-900">
            Software Name *
          </label>
          <input
            type="text"
            id="softwareName"
            {...register("eulaInfo.softwareName", { required: "Software name is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., MyApp Pro"
          />
          {errors.eulaInfo?.softwareName && (
            <p className="mt-1 text-sm text-red-600">{errors.eulaInfo.softwareName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="softwareType" className="block text-sm font-medium text-gray-900">
            Software Type *
          </label>
          <select
            id="softwareType"
            {...register("eulaInfo.softwareType", { required: "Software type is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a type...</option>
            {SOFTWARE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.eulaInfo?.softwareType && (
            <p className="mt-1 text-sm text-red-600">{errors.eulaInfo.softwareType.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("eulaInfo.autoUpdates")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Software has automatic updates</span>
              <p className="mt-1 text-sm text-gray-600">
                The software can update itself without user action
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("eulaInfo.collectsData")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Software collects usage data</span>
              <p className="mt-1 text-sm text-gray-600">
                Analytics, crash reports, or other telemetry
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
