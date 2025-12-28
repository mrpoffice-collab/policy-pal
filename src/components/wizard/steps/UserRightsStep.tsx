"use client";

import { useFormContext } from "react-hook-form";
import { RESPONSE_TIMES, type PrivacyWizardAnswers } from "@/lib/types";

export function UserRightsStep() {
  const { register, formState: { errors } } = useFormContext<PrivacyWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Rights</h2>
        <p className="mt-1 text-gray-600">How can users exercise their data rights?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            How can users request access, deletion, or correction? *
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="email"
                {...register("userRights.requestMethod", { required: "Select a request method" })}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Email</span>
                <p className="text-sm text-gray-600">
                  Users send requests to your privacy contact email
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="form"
                {...register("userRights.requestMethod", { required: "Select a request method" })}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Web Form</span>
                <p className="text-sm text-gray-600">
                  Users submit requests through a form on your website
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="in-app"
                {...register("userRights.requestMethod", { required: "Select a request method" })}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">In-App Settings</span>
                <p className="text-sm text-gray-600">
                  Users can manage their data directly in their account settings
                </p>
              </div>
            </label>
          </div>
          {errors.userRights?.requestMethod && (
            <p className="mt-2 text-sm text-red-600">{errors.userRights.requestMethod.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="responseTime" className="block text-sm font-medium text-gray-900">
            What is your typical response time for data requests? *
          </label>
          <p className="text-sm text-gray-600 mb-2">
            GDPR requires responses within 30 days. CCPA allows 45 days.
          </p>
          <select
            id="responseTime"
            {...register("userRights.responseTime", { required: "Response time is required" })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select response time...</option>
            {RESPONSE_TIMES.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
          {errors.userRights?.responseTime && (
            <p className="mt-1 text-sm text-red-600">{errors.userRights.responseTime.message as string}</p>
          )}
        </div>
      </div>
    </div>
  );
}
