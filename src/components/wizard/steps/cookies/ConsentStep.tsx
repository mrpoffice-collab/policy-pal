"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { CONSENT_MECHANISMS, type CookieWizardAnswers } from "@/lib/types";

export function ConsentStep() {
  const { register, watch, formState: { errors } } = useFormContext<CookieWizardAnswers>();
  const hasEUUsers = watch("geographicScope.hasEUUsers");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cookie Consent</h2>
        <p className="mt-1 text-gray-600">How do you obtain consent for non-essential cookies?</p>
      </div>

      <div className="space-y-6">
        {hasEUUsers && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">GDPR Requirement</h3>
              <p className="text-sm text-amber-700 mt-1">
                Since you have EU users, you must obtain explicit consent before setting
                non-essential cookies. Opt-in consent is required.
              </p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="consentMechanism" className="block text-sm font-medium text-gray-900">
            Consent Mechanism *
          </label>
          <select
            id="consentMechanism"
            {...register("cookieInfo.consentMechanism", { required: "Consent mechanism is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a method...</option>
            {CONSENT_MECHANISMS.map((mechanism) => (
              <option key={mechanism.value} value={mechanism.value}>{mechanism.label}</option>
            ))}
          </select>
          {errors.cookieInfo?.consentMechanism && (
            <p className="mt-1 text-sm text-red-600">{errors.cookieInfo.consentMechanism.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("cookieInfo.usesThirdPartyCookies")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">We use third-party cookies</span>
              <p className="mt-1 text-sm text-gray-600">
                Cookies set by external services (Google, Facebook, analytics tools, etc.)
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Cookie Banner Features</h3>
          <p className="text-sm text-gray-600 mb-2">
            Your cookie banner will include:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>- Clear explanation of cookie usage</li>
            <li>- Accept all / Reject all buttons</li>
            <li>- Granular category controls</li>
            <li>- Link to your cookie policy</li>
            <li>- Consent logging for compliance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
