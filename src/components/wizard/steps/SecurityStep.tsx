"use client";

import { useFormContext } from "react-hook-form";
import { Shield } from "lucide-react";
import { SECURITY_MEASURES, type PrivacyWizardAnswers } from "@/lib/types";

export function SecurityStep() {
  const { register, formState: { errors } } = useFormContext<PrivacyWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security Measures</h2>
        <p className="mt-1 text-gray-600">How do you protect user data?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            What security measures do you implement? *
          </label>
          <div className="space-y-2">
            {SECURITY_MEASURES.map((measure) => (
              <label
                key={measure}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={measure}
                  {...register("securityMeasures.measures", { required: "Select at least one measure" })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-900">{measure}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.securityMeasures?.measures && (
            <p className="mt-2 text-sm text-red-600">{errors.securityMeasures.measures.message as string}</p>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("securityMeasures.hadBreach")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">We have experienced a data breach in the past</span>
              <p className="mt-1 text-sm text-gray-600">
                This information is for internal assessment only and will not appear in your policy.
                If you've had a breach, ensure you have proper notification procedures in place.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Security Best Practices</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Regularly update and patch your systems</li>
            <li>• Implement the principle of least privilege</li>
            <li>• Train employees on data protection</li>
            <li>• Have an incident response plan ready</li>
            <li>• Conduct regular security audits</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
