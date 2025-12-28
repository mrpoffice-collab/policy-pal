"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
  subscription?: {
    tier: string;
    status: string;
    currentPeriodEnd: string | null;
  };
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    interval: "forever",
    features: ["3 policies", "Basic templates", "Hosted pages"],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "$19",
    yearlyPrice: "$190",
    features: [
      "Unlimited policies",
      "All templates",
      "Custom branding",
      "PDF/Word export",
      "Translation (5 languages)",
    ],
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: "$49",
    yearlyPrice: "$490",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Priority support",
      "Custom domain",
    ],
  },
];

function BillingContent() {
  const searchParams = useSearchParams();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setMessage("Subscription activated successfully!");
    } else if (searchParams.get("canceled") === "true") {
      setMessage("Subscription canceled.");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await fetch("/api/organizations");
      const data = await res.json();
      setOrganizations(data.organizations || []);
      if (data.organizations?.length > 0) {
        setSelectedOrg(data.organizations[0].id);
      }
    } catch {
      console.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    if (!selectedOrg) return;

    setUpgrading(true);
    setMessage("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: selectedOrg, plan, interval }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || "Failed to start checkout");
      }
    } catch {
      setMessage("Failed to start checkout");
    } finally {
      setUpgrading(false);
    }
  };

  const currentOrg = organizations.find((o) => o.id === selectedOrg);
  const currentTier = currentOrg?.subscription?.tier || "free";

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing & Plans</h2>
        <p className="text-sm text-gray-500">Manage your subscription and billing</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
          {message}
        </div>
      )}

      {organizations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No organizations yet</p>
          <a href="/dashboard" className="text-indigo-600 hover:text-indigo-700">
            Create your first organization
          </a>
        </div>
      ) : (
        <>
          {/* Organization Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          {/* Current Plan */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Current Plan</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{currentTier}</p>
            {currentOrg?.subscription?.currentPeriodEnd && (
              <p className="text-sm text-gray-500">
                Renews on {new Date(currentOrg.subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Billing Interval */}
          <div className="flex justify-center gap-2 p-1 bg-gray-100 rounded-lg w-fit mx-auto">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                interval === "monthly"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval("yearly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                interval === "yearly"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Yearly (Save 17%)
            </button>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const isCurrentPlan = currentTier === plan.id;
              const price = plan.id === "free"
                ? plan.price
                : interval === "monthly"
                  ? plan.monthlyPrice
                  : plan.yearlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`p-6 rounded-xl border-2 ${
                    isCurrentPlan
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{price}</span>
                    {plan.id !== "free" && (
                      <span className="text-gray-500">/{interval === "monthly" ? "mo" : "yr"}</span>
                    )}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || plan.id === "free" || upgrading}
                    className={`mt-6 w-full py-2 rounded-lg font-medium transition-colors ${
                      isCurrentPlan
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : plan.id === "free"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {isCurrentPlan ? "Current Plan" : plan.id === "free" ? "Free" : "Upgrade"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
      <BillingContent />
    </Suspense>
  );
}
