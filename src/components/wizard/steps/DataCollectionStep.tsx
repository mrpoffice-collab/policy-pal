"use client";

import { useFormContext } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import { DATA_TYPES, COLLECTION_METHODS, RETENTION_PERIODS, type PrivacyWizardAnswers } from "@/lib/types";

export function DataCollectionStep() {
  const { register, watch, formState: { errors } } = useFormContext<PrivacyWizardAnswers>();

  const collectsChildrenData = watch("dataCollection.collectsChildrenData");
  const collectsSensitiveData = watch("dataCollection.collectsSensitiveData");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Data Collection</h2>
        <p className="mt-1 text-gray-600">What personal data do you collect from users?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            What personal data do you collect? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {DATA_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={type}
                  {...register("dataCollection.dataTypes", { required: "Select at least one data type" })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{type}</span>
              </label>
            ))}
          </div>
          {errors.dataCollection?.dataTypes && (
            <p className="mt-2 text-sm text-red-600">{errors.dataCollection.dataTypes.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            How do you collect this data? *
          </label>
          <div className="space-y-2">
            {COLLECTION_METHODS.map((method) => (
              <label
                key={method}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={method}
                  {...register("dataCollection.collectionMethods", { required: "Select at least one method" })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{method}</span>
              </label>
            ))}
          </div>
          {errors.dataCollection?.collectionMethods && (
            <p className="mt-2 text-sm text-red-600">{errors.dataCollection.collectionMethods.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("dataCollection.collectsChildrenData")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">We collect data from children under 13</span>
              <p className="mt-1 text-sm text-gray-600">
                Check this if your service is directed at or knowingly collects data from children
              </p>
            </div>
          </label>

          {collectsChildrenData && (
            <div className="ml-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  <strong>COPPA applies.</strong> Your policy will include Children&apos;s Online Privacy
                  Protection Act compliance sections. You must obtain verifiable parental consent.
                </p>
              </div>
            </div>
          )}

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("dataCollection.collectsSensitiveData")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">We collect sensitive data</span>
              <p className="mt-1 text-sm text-gray-600">
                Health information, biometric data, financial data, racial/ethnic origin, etc.
              </p>
            </div>
          </label>

          {collectsSensitiveData && (
            <div className="ml-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  <strong>Enhanced protections required.</strong> Your policy will include additional
                  safeguards and explicit consent requirements for sensitive data categories.
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="retentionPeriod" className="block text-sm font-medium text-gray-900">
            How long do you retain personal data? *
          </label>
          <select
            id="retentionPeriod"
            {...register("dataCollection.retentionPeriod", { required: "Retention period is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a period...</option>
            {RETENTION_PERIODS.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          {errors.dataCollection?.retentionPeriod && (
            <p className="mt-1 text-sm text-red-600">{errors.dataCollection.retentionPeriod.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
