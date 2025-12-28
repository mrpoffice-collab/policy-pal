import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Get a specific policy
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        org: true,
        versions: { orderBy: { createdAt: "desc" }, take: 10 },
        translations: true,
      },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Verify access
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

    return NextResponse.json({ policy });
  } catch (error) {
    console.error("Get policy error:", error);
    return NextResponse.json(
      { error: "Failed to get policy" },
      { status: 500 }
    );
  }
}

// Update a policy
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, content, hosted } = body;

    const policy = await prisma.policy.findUnique({
      where: { id },
      include: { org: true },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Verify access
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

    // Prepare update data
    const updateData: { name?: string; content?: string; hostedSlug?: string | null } = {};

    if (name !== undefined) updateData.name = name;
    if (content !== undefined) updateData.content = content;
    if (hosted !== undefined) {
      if (hosted && !policy.hostedSlug) {
        updateData.hostedSlug = nanoid(10);
      } else if (!hosted) {
        updateData.hostedSlug = null;
      }
    }

    // Update policy
    const updatedPolicy = await prisma.policy.update({
      where: { id },
      data: updateData,
    });

    // Create new version if content changed
    if (content !== undefined && content !== policy.content) {
      await prisma.policyVersion.create({
        data: {
          policyId: id,
          content,
        },
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        orgId: policy.orgId,
        userId: session.user.id,
        action: "updated",
        resource: "policy",
        resourceId: id,
        details: { changes: Object.keys(updateData) },
      },
    });

    return NextResponse.json({
      policy: updatedPolicy,
      hostedUrl: updatedPolicy.hostedSlug ? `/p/${updatedPolicy.hostedSlug}` : null,
    });
  } catch (error) {
    console.error("Update policy error:", error);
    return NextResponse.json(
      { error: "Failed to update policy" },
      { status: 500 }
    );
  }
}

// Delete a policy
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const policy = await prisma.policy.findUnique({
      where: { id },
      include: { org: true },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Verify access - only owner or admin can delete
    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: session.user.id,
          orgId: policy.orgId,
        },
      },
    });

    const isOwner = policy.org.ownerId === session.user.id;
    const isAdmin = membership?.role === "admin" || membership?.role === "owner";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await prisma.policy.delete({ where: { id } });

    // Log activity
    await prisma.activityLog.create({
      data: {
        orgId: policy.orgId,
        userId: session.user.id,
        action: "deleted",
        resource: "policy",
        resourceId: id,
        details: { name: policy.name, type: policy.type },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete policy error:", error);
    return NextResponse.json(
      { error: "Failed to delete policy" },
      { status: 500 }
    );
  }
}
