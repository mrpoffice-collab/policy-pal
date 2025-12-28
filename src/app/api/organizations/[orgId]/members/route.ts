import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ orgId: string }>;
}

// Get members
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { orgId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify access
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: session.user.id,
          orgId,
        },
      },
    });

    if (!membership && org.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const members = await prisma.membership.findMany({
      where: { orgId },
      include: {
        user: {
          select: { id: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Get members error:", error);
    return NextResponse.json({ error: "Failed to get members" }, { status: 500 });
  }
}

// Invite member
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { orgId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
    }

    // Verify admin/owner access
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: session.user.id,
          orgId,
        },
      },
    });

    const isOwner = org.ownerId === session.user.id;
    const isAdmin = membership?.role === "admin" || membership?.role === "owner";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Only admins can invite members" }, { status: 403 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // TODO: Send invitation email for non-existing users
      return NextResponse.json({
        error: "User not found. They need to create an account first.",
      }, { status: 400 });
    }

    // Check if already a member
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: user.id,
          orgId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json({ error: "User is already a member" }, { status: 400 });
    }

    // Add member
    const newMembership = await prisma.membership.create({
      data: {
        userId: user.id,
        orgId,
        role,
      },
      include: {
        user: { select: { id: true, email: true, image: true } },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        orgId,
        userId: session.user.id,
        action: "invited",
        resource: "member",
        resourceId: user.id,
        details: { email, role },
      },
    });

    return NextResponse.json({ membership: newMembership });
  } catch (error) {
    console.error("Invite member error:", error);
    return NextResponse.json({ error: "Failed to invite member" }, { status: 500 });
  }
}
