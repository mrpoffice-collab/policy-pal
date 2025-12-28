"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";

interface BannerConfig {
  position: "bottom" | "top" | "center";
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
}

export function BannerDesignStep() {
  const { register, watch, setValue } = useFormContext();
  const [preview, setPreview] = useState(false);

  const position = watch("bannerConfig.position") || "bottom";
  const backgroundColor = watch("bannerConfig.backgroundColor") || "#1f2937";
  const textColor = watch("bannerConfig.textColor") || "#ffffff";
  const buttonColor = watch("bannerConfig.buttonColor") || "#3b82f6";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cookie Banner Design</h2>
        <p className="mt-1 text-gray-600">Customize the look of your cookie consent banner</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Banner Position
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["bottom", "top", "center"].map((pos) => (
              <label
                key={pos}
                className={`p-4 rounded-lg border-2 cursor-pointer text-center ${
                  position === pos
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value={pos}
                  {...register("bannerConfig.position")}
                  className="sr-only"
                />
                <span className="capitalize font-medium text-gray-900">{pos}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                {...register("bannerConfig.backgroundColor")}
                className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setValue("bannerConfig.backgroundColor", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 text-sm"
                placeholder="#1f2937"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Text Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                {...register("bannerConfig.textColor")}
                className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setValue("bannerConfig.textColor", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Button Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                {...register("bannerConfig.buttonColor")}
                className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={buttonColor}
                onChange={(e) => setValue("bannerConfig.buttonColor", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 text-sm"
                placeholder="#3b82f6"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {preview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>

        {preview && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-100">
            <p className="text-sm text-gray-600 mb-3">Preview:</p>
            <div
              className={`rounded-lg p-4 ${
                position === "center" ? "max-w-md mx-auto" : "w-full"
              }`}
              style={{ backgroundColor, color: textColor }}
            >
              <p className="text-sm mb-3">
                We use cookies to enhance your browsing experience and analyze site traffic.
              </p>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: buttonColor, color: "#ffffff" }}
                >
                  Accept All
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium border"
                  style={{ borderColor: textColor, color: textColor }}
                >
                  Reject All
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium underline"
                  style={{ color: textColor }}
                >
                  Customize
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">What You Get</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>- Ready-to-use JavaScript snippet for your website</li>
            <li>- Fully customizable banner appearance</li>
            <li>- GDPR-compliant consent management</li>
            <li>- Consent logging for audit trails</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
