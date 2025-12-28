import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Create organization
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    // Check if slug is available
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      return NextResponse.json({ error: "Slug already taken" }, { status: 400 });
    }

    // Create organization
    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        ownerId: session.user.id,
      },
    });

    // Add owner as member
    await prisma.membership.create({
      data: {
        userId: session.user.id,
        orgId: org.id,
        role: "owner",
      },
    });

    // Create free subscription
    await prisma.subscription.create({
      data: {
        orgId: org.id,
        tier: "free",
        status: "active",
      },
    });

    return NextResponse.json({ org });
  } catch (error) {
    console.error("Create org error:", error);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}

// Get user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memberships = await prisma.membership.findMany({
      where: { userId: session.user.id },
      include: {
        org: {
          include: {
            subscription: true,
            _count: { select: { policies: true, memberships: true } },
          },
        },
      },
    });

    const ownedOrgs = await prisma.organization.findMany({
      where: { ownerId: session.user.id },
      include: {
        subscription: true,
        _count: { select: { policies: true, memberships: true } },
      },
    });

    // Combine and dedupe
    const orgMap = new Map();
    for (const org of ownedOrgs) {
      orgMap.set(org.id, { ...org, role: "owner" });
    }
    for (const m of memberships) {
      if (!orgMap.has(m.orgId)) {
        orgMap.set(m.orgId, { ...m.org, role: m.role });
      }
    }

    const organizations = Array.from(orgMap.values());

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error("Get orgs error:", error);
    return NextResponse.json({ error: "Failed to get organizations" }, { status: 500 });
  }
}
