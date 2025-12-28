import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const policyId = searchParams.get("id");
  const style = searchParams.get("style") || "default";

  if (!policyId) {
    return new NextResponse("Missing policy ID", { status: 400 });
  }

  const policy = await prisma.policy.findUnique({
    where: { id: policyId },
    include: { org: { select: { name: true } } },
  });

  if (!policy) {
    return new NextResponse("Policy not found", { status: 404 });
  }

  const policyTypeLabels: Record<string, string> = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    eula: "EULA",
    cookies: "Cookie Policy",
  };

  const lastUpdated = new Date(policy.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Generate SVG badge
  let svg: string;
  const baseUrl = process.env.NEXTAUTH_URL || "https://policypal.com";
  const policyUrl = policy.hostedSlug ? `${baseUrl}/p/${policy.hostedSlug}` : baseUrl;

  if (style === "compact") {
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="24">
  <a href="${policyUrl}" target="_blank">
    <rect width="150" height="24" rx="4" fill="#3b82f6"/>
    <text x="12" y="16" fill="white" font-family="system-ui" font-size="11" font-weight="500">
      ${policyTypeLabels[policy.type] || policy.type}
    </text>
    <circle cx="135" cy="12" r="5" fill="#22c55e"/>
  </a>
</svg>`;
  } else if (style === "minimal") {
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="20">
  <a href="${policyUrl}" target="_blank">
    <rect width="100" height="20" rx="3" fill="#f3f4f6" stroke="#e5e7eb"/>
    <circle cx="10" cy="10" r="4" fill="#22c55e"/>
    <text x="20" y="14" fill="#374151" font-family="system-ui" font-size="10">
      Compliant
    </text>
  </a>
</svg>`;
  } else {
    // Default style
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
  </defs>
  <a href="${policyUrl}" target="_blank">
    <rect width="200" height="60" rx="8" fill="url(#bg)"/>
    <text x="16" y="24" fill="white" font-family="system-ui" font-size="13" font-weight="600">
      ${policyTypeLabels[policy.type] || policy.type}
    </text>
    <text x="16" y="42" fill="rgba(255,255,255,0.8)" font-family="system-ui" font-size="10">
      Updated: ${lastUpdated}
    </text>
    <circle cx="180" cy="30" r="8" fill="#22c55e"/>
    <path d="M176 30 l3 3 l6 -6" stroke="white" stroke-width="2" fill="none"/>
  </a>
</svg>`;
  }

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
