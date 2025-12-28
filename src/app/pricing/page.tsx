"use client";

import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "3 policies",
      "Privacy Policy generator",
      "Terms of Service generator",
      "Hosted pages",
      "Basic export (Markdown)",
    ],
    limitations: [
      "No cookie banner",
      "No translations",
      "No team access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses",
    monthlyPrice: 19,
    yearlyPrice: 190,
    popular: true,
    features: [
      "Unlimited policies",
      "All policy types",
      "PDF & Word export",
      "Cookie consent banner",
      "5 language translations",
      "Compliance badges",
      "Auto-updates",
      "Custom branding",
    ],
    limitations: [],
  },
  {
    id: "business",
    name: "Business",
    description: "For teams and enterprises",
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Role-based access",
      "API access",
      "Custom domain",
      "Priority support",
      "Audit logs",
      "SSO (coming soon)",
    ],
    limitations: [],
  },
];

export default function PricingPage() {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            PolicyPal
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our AI-powered policy generator.
          </p>

          {/* Interval Toggle */}
          <div className="mt-8 flex justify-center gap-2 p-1 bg-gray-100 rounded-lg w-fit mx-auto">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-6 py-2 rounded-md transition-colors ${
                interval === "monthly"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval("yearly")}
              className={`px-6 py-2 rounded-md transition-colors ${
                interval === "yearly"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const price = interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative p-8 rounded-2xl border-2 bg-white ${
                  plan.popular
                    ? "border-indigo-500 shadow-xl"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 mt-1">{plan.description}</p>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  {price > 0 && (
                    <span className="text-gray-500">/{interval === "monthly" ? "mo" : "yr"}</span>
                  )}
                </div>

                <Link
                  href="/register"
                  className={`mt-8 block w-full py-3 text-center rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.id === "free" ? "Start Free" : "Get Started"}
                </Link>

                <div className="mt-8">
                  <p className="text-sm font-medium text-gray-900 mb-4">What&apos;s included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-3 text-sm text-gray-400">
                        <svg
                          className="w-5 h-5 text-gray-300 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900">Can I change plans later?</h3>
              <p className="text-gray-600 mt-2">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900">Are the policies legally binding?</h3>
              <p className="text-gray-600 mt-2">
                Our AI-generated policies are designed to meet legal requirements, but we recommend having them reviewed by a legal professional for your specific jurisdiction.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900">What payment methods do you accept?</h3>
              <p className="text-gray-600 mt-2">
                We accept all major credit cards through our secure payment processor, Stripe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900">Can I cancel anytime?</h3>
              <p className="text-gray-600 mt-2">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-indigo-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Generate your first privacy policy in under 5 minutes. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} PolicyPal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
