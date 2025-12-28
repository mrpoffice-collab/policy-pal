"use client";

import { useFormContext } from "react-hook-form";
import { Cookie } from "lucide-react";
import { COOKIE_TYPES, type CookieWizardAnswers } from "@/lib/types";

export function CookieTypesStep() {
  const { register, formState: { errors } } = useFormContext<CookieWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cookie Types</h2>
        <p className="mt-1 text-gray-600">What types of cookies does your website use?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Select all cookie types you use *
          </label>
          <div className="space-y-2">
            {COOKIE_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={type}
                  {...register("cookieInfo.cookieTypes", { required: "Select at least one cookie type" })}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-900">{type}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.cookieInfo?.cookieTypes && (
            <p className="mt-2 text-sm text-red-600">{errors.cookieInfo.cookieTypes.message}</p>
          )}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Cookie Categories Explained</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li><strong>Essential:</strong> Required for the website to function (login, cart, security)</li>
            <li><strong>Analytics:</strong> Help understand how visitors use the site (Google Analytics)</li>
            <li><strong>Marketing:</strong> Track visitors for advertising purposes</li>
            <li><strong>Functional:</strong> Remember preferences (language, theme)</li>
            <li><strong>Social media:</strong> Enable social sharing features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
