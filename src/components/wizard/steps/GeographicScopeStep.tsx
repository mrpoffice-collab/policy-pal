"use client";

import { useFormContext } from "react-hook-form";
import { Globe, AlertCircle } from "lucide-react";
import type { PrivacyWizardAnswers } from "@/lib/types";

export function GeographicScopeStep() {
  const { register, watch, formState: { errors } } = useFormContext<PrivacyWizardAnswers>();

  const hasEUUsers = watch("geographicScope.hasEUUsers");
  const hasCAUsers = watch("geographicScope.hasCAUsers");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Geographic Scope</h2>
        <p className="mt-1 text-gray-600">Where are your users located? This determines which regulations apply.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("geographicScope.hasEUUsers")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">European Union Users</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                We have or expect users from EU countries
              </p>
            </div>
          </label>

          {hasEUUsers && (
            <div className="ml-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <strong>GDPR applies.</strong> Your policy will include GDPR-compliant rights sections:
                  Right to Access, Rectification, Erasure, Portability, Object, and Restrict Processing.
                </p>
              </div>
            </div>
          )}

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("geographicScope.hasCAUsers")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-gray-900">California Users</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                We have or expect users from California, USA
              </p>
            </div>
          </label>

          {hasCAUsers && (
            <div className="ml-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  <strong>CCPA/CPRA applies.</strong> Your policy will include California Privacy Rights
                  and &quot;Do Not Sell My Personal Information&quot; language.
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="businessLocation" className="block text-sm font-medium text-gray-900">
            Primary Business Location *
          </label>
          <input
            type="text"
            id="businessLocation"
            {...register("geographicScope.businessLocation", { required: "Business location is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Delaware, USA or London, UK"
          />
          {errors.geographicScope?.businessLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.geographicScope.businessLocation.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            This determines governing law and jurisdiction for your policy.
          </p>
        </div>
      </div>
    </div>
  );
}
