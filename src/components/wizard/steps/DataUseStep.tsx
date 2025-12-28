"use client";

import { useFormContext } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import { DATA_PURPOSES, type PrivacyWizardAnswers } from "@/lib/types";

export function DataUseStep() {
  const { register, watch, formState: { errors } } = useFormContext<PrivacyWizardAnswers>();

  const sellsData = watch("dataUse.sellsData");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Data Use</h2>
        <p className="mt-1 text-gray-600">How do you use the data you collect?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            What purposes do you use data for? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {DATA_PURPOSES.map((purpose) => (
              <label
                key={purpose}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={purpose}
                  {...register("dataUse.purposes", { required: "Select at least one purpose" })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{purpose}</span>
              </label>
            ))}
          </div>
          {errors.dataUse?.purposes && (
            <p className="mt-2 text-sm text-red-600">{errors.dataUse.purposes.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("dataUse.automatedDecisionMaking")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">We use automated decision-making or profiling</span>
              <p className="mt-1 text-sm text-gray-600">
                Includes algorithmic decisions that significantly affect users, personalization,
                credit scoring, or automated content moderation
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("dataUse.sellsData")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">We sell or share data for advertising</span>
              <p className="mt-1 text-sm text-gray-600">
                Includes sharing data with ad networks, data brokers, or for targeted advertising
              </p>
            </div>
          </label>

          {sellsData && (
            <div className="ml-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Important CCPA/CPRA requirement:</p>
                  <p className="mt-1">
                    If you have California users, you must provide a &quot;Do Not Sell or Share My Personal
                    Information&quot; link on your website. This will be included in your policy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
