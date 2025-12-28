import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  Plus,
  FileText,
  Shield,
  Scale,
  Cookie,
  Clock,
  ExternalLink,
  Settings,
  LogOut,
  AlertTriangle
} from "lucide-react";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

const POLICY_ICONS: Record<string, React.ReactNode> = {
  privacy: <Shield className="w-5 h-5 text-blue-600" />,
  terms: <Scale className="w-5 h-5 text-purple-600" />,
  eula: <FileText className="w-5 h-5 text-green-600" />,
  cookies: <Cookie className="w-5 h-5 text-amber-600" />,
};

const POLICY_LABELS: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  eula: "End User License Agreement",
  cookies: "Cookie Policy",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get user's organizations and policies
  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: {
      org: {
        include: {
          policies: {
            orderBy: { updatedAt: "desc" },
          },
          subscription: true,
        },
      },
    },
  });

  // Check for owned orgs without membership
  const ownedOrgs = await prisma.organization.findMany({
    where: { ownerId: session.user.id },
    include: {
      policies: {
        orderBy: { updatedAt: "desc" },
      },
      subscription: true,
    },
  });

  // Combine and dedupe orgs
  type OrgWithPolicies = typeof ownedOrgs[number];
  const orgMap = new Map<string, OrgWithPolicies>();
  for (const org of ownedOrgs) {
    orgMap.set(org.id, org);
  }
  for (const m of memberships) {
    if (!orgMap.has(m.orgId)) {
      orgMap.set(m.orgId, m.org);
    }
  }

  const organizations = Array.from(orgMap.values());
  const hasOrgs = organizations.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PolicyPal</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user.email}</span>
              <Link
                href="/settings"
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage your legal policies and stay compliant</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/generate?type=privacy"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Privacy Policy</span>
              <p className="text-sm text-gray-500">GDPR & CCPA ready</p>
            </div>
          </Link>
          <Link
            href="/generate?type=terms"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Scale className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Terms of Service</span>
              <p className="text-sm text-gray-500">Protect your business</p>
            </div>
          </Link>
          <Link
            href="/generate?type=eula"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">EULA</span>
              <p className="text-sm text-gray-500">For software products</p>
            </div>
          </Link>
          <Link
            href="/generate?type=cookies"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-amber-100 rounded-lg">
              <Cookie className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Cookie Policy</span>
              <p className="text-sm text-gray-500">EU cookie compliance</p>
            </div>
          </Link>
        </div>

        {/* Policies List */}
        {!hasOrgs ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Create your first policy
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by generating a privacy policy, terms of service, or other legal documents for your business.
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Generate Policy
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {organizations.map((org) => (
              <div key={org.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-gray-900">{org.name}</h2>
                    <p className="text-sm text-gray-500">
                      {org.policies.length} {org.policies.length === 1 ? "policy" : "policies"}
                    </p>
                  </div>
                  <Link
                    href={`/generate?org=${org.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Policy
                  </Link>
                </div>

                {org.policies.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No policies yet. Create your first policy to get started.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {org.policies.map((policy) => (
                      <div
                        key={policy.id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {POLICY_ICONS[policy.type] || <FileText className="w-5 h-5 text-gray-600" />}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{policy.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span>{POLICY_LABELS[policy.type] || policy.type}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Updated {new Date(policy.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {policy.hostedSlug && (
                            <Link
                              href={`/p/${policy.hostedSlug}`}
                              target="_blank"
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                              title="View hosted page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            href={`/policies/${policy.id}`}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Compliance Alerts */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Stay Compliant</h3>
            <p className="text-sm text-amber-700 mt-1">
              PolicyPal automatically monitors for law changes and notifies you when your policies need updates.
              Enable notifications in settings to stay informed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
