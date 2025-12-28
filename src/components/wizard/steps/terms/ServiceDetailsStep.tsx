"use client";

import { useFormContext } from "react-hook-form";
import { SERVICE_TYPES, type TermsWizardAnswers } from "@/lib/types";

export function ServiceDetailsStep() {
  const { register, watch, formState: { errors } } = useFormContext<TermsWizardAnswers>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Service Details</h2>
        <p className="mt-1 text-gray-600">Tell us about the service you provide</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-900">
            What type of service do you offer? *
          </label>
          <select
            id="serviceType"
            {...register("serviceInfo.serviceType", { required: "Service type is required" })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a type...</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.serviceInfo?.serviceType && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceInfo.serviceType.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("serviceInfo.hasFreeTier")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">We offer a free tier or trial</span>
              <p className="mt-1 text-sm text-gray-600">
                Users can access some features without payment
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("serviceInfo.hasPayments")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">We accept payments</span>
              <p className="mt-1 text-sm text-gray-600">
                Users can purchase subscriptions, products, or services
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("serviceInfo.hasAccounts")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Users create accounts</span>
              <p className="mt-1 text-sm text-gray-600">
                Users register and log in to access features
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              {...register("serviceInfo.hasUserContent")}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Users can submit content</span>
              <p className="mt-1 text-sm text-gray-600">
                Posts, comments, uploads, or other user-generated content
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
