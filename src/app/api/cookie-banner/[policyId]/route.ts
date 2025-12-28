import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ policyId: string }>;
}

// Get cookie banner config
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { policyId } = await params;

    const banner = await prisma.cookieBanner.findUnique({
      where: { policyId },
      include: {
        policy: {
          select: {
            hostedSlug: true,
            org: { select: { name: true } },
          },
        },
      },
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Get banner error:", error);
    return NextResponse.json({ error: "Failed to get banner" }, { status: 500 });
  }
}

// Create or update cookie banner
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { policyId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { position, theme, text } = body;

    // Verify policy exists and user has access
    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
      include: { org: true },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: session.user.id,
          orgId: policy.orgId,
        },
      },
    });

    if (!membership && policy.org.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Upsert banner config
    const banner = await prisma.cookieBanner.upsert({
      where: { policyId },
      update: {
        position: position || "bottom",
        theme: theme || {},
        text: text || {},
      },
      create: {
        policyId,
        position: position || "bottom",
        theme: theme || {
          backgroundColor: "#1f2937",
          textColor: "#ffffff",
          buttonColor: "#3b82f6",
          buttonTextColor: "#ffffff",
        },
        text: text || {
          title: "We use cookies",
          description: "We use cookies to enhance your browsing experience and analyze site traffic.",
          acceptAll: "Accept All",
          rejectAll: "Reject All",
          customize: "Customize",
        },
      },
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Update banner error:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}
