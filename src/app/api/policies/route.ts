import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

// Create a new policy
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orgId, name, type, answers, content, hosted = false } = body;

    if (!orgId || !type || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user has access to the organization
    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: session.user.id,
          orgId,
        },
      },
    });

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!membership && org?.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Generate hosted slug if requested
    const hostedSlug = hosted ? nanoid(10) : null;

    // Create policy
    const policy = await prisma.policy.create({
      data: {
        orgId,
        name: name || `${type} Policy`,
        type,
        answers: answers || {},
        content,
        hostedSlug,
      },
    });

    // Create initial version
    await prisma.policyVersion.create({
      data: {
        policyId: policy.id,
        content,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        orgId,
        userId: session.user.id,
        action: "created",
        resource: "policy",
        resourceId: policy.id,
        details: { type, name: policy.name },
      },
    });

    return NextResponse.json({
      policy,
      hostedUrl: hostedSlug ? `/p/${hostedSlug}` : null,
    });
  } catch (error) {
    console.error("Create policy error:", error);
    return NextResponse.json(
      { error: "Failed to create policy" },
      { status: 500 }
    );
  }
}

// Get all policies for user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all organizations the user has access to
    const memberships = await prisma.membership.findMany({
      where: { userId: session.user.id },
      select: { orgId: true },
    });

    const ownedOrgs = await prisma.organization.findMany({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    const orgIds = [
      ...memberships.map((m) => m.orgId),
      ...ownedOrgs.map((o) => o.id),
    ];

    const policies = await prisma.policy.findMany({
      where: { orgId: { in: orgIds } },
      include: {
        org: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ policies });
  } catch (error) {
    console.error("Get policies error:", error);
    return NextResponse.json(
      { error: "Failed to get policies" },
      { status: 500 }
    );
  }
}
