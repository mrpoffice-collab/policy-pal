import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Shield } from "lucide-react";
import Link from "next/link";

interface HostedPolicyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: HostedPolicyPageProps) {
  const { slug } = await params;
  const policy = await prisma.policy.findUnique({
    where: { hostedSlug: slug },
    include: { org: true },
  });

  if (!policy) {
    return { title: "Policy Not Found" };
  }

  const policyTypeNames: Record<string, string> = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    eula: "End User License Agreement",
    cookies: "Cookie Policy",
  };

  return {
    title: `${policyTypeNames[policy.type] || policy.type} - ${policy.org.name}`,
    description: `${policyTypeNames[policy.type] || policy.type} for ${policy.org.name}`,
  };
}

export default async function HostedPolicyPage({ params }: HostedPolicyPageProps) {
  const { slug } = await params;

  const policy = await prisma.policy.findUnique({
    where: { hostedSlug: slug },
    include: { org: true },
  });

  if (!policy) {
    notFound();
  }

  const policyTypeNames: Record<string, string> = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    eula: "End User License Agreement",
    cookies: "Cookie Policy",
  };

  const formattedContent = policy.content.replace(
    "[LAST_UPDATED_DATE]",
    new Date(policy.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{policy.org.name}</h1>
              <p className="text-sm text-gray-500">{policyTypeNames[policy.type]}</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <Shield className="w-4 h-4" />
              Powered by PolicyPal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12">
          <div className="prose prose-gray max-w-none">
            {formattedContent.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={i} className="text-3xl font-bold text-gray-900 mb-6">
                    {line.slice(2)}
                  </h1>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-xl font-semibold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200"
                  >
                    {line.slice(3)}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-lg font-medium text-gray-900 mt-6 mb-3">
                    {line.slice(4)}
                  </h3>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="ml-6 text-gray-700 my-1">
                    {line.slice(2)}
                  </li>
                );
              }
              if (line.trim() === "") {
                return <br key={i} />;
              }
              return (
                <p key={i} className="text-gray-700 my-3 leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Last updated: {new Date(policy.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-2">
            Need legal policies for your business?{" "}
            <Link href="/" className="text-blue-600 hover:text-blue-500">
              Try PolicyPal
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
