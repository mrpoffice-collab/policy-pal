"use client";

import { useFormContext } from "react-hook-form";
import { Ban } from "lucide-react";
import { PROHIBITED_ACTIVITIES, type TermsWizardAnswers } from "@/lib/types";

export function ProhibitedUsesStep() {
  const { register, formState: { errors } } = useFormContext<TermsWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Prohibited Uses</h2>
        <p className="mt-1 text-gray-600">What activities are not allowed on your platform?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Select prohibited activities *
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Choose all that apply. These will be listed in your Terms of Service.
          </p>
          <div className="space-y-2">
            {PROHIBITED_ACTIVITIES.map((activity) => (
              <label
                key={activity}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={activity}
                  {...register("serviceInfo.prohibitedActivities", { required: "Select at least one" })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-900">{activity}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.serviceInfo?.prohibitedActivities && (
            <p className="mt-2 text-sm text-red-600">{errors.serviceInfo.prohibitedActivities.message}</p>
          )}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-medium text-amber-800 mb-2">Best Practices</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>- Be specific about what activities are prohibited</li>
            <li>- Include consequences for violations (account suspension, termination)</li>
            <li>- Reserve the right to modify prohibited activities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
