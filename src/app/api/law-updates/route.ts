import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Get pending law updates for user's policies
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organizations
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

    // Get policies
    const policies = await prisma.policy.findMany({
      where: { orgId: { in: orgIds } },
      select: { id: true, type: true, lawVersion: true },
    });

    // Get latest law versions
    const latestVersions = await prisma.lawVersion.findMany({
      orderBy: { effectiveDate: "desc" },
      distinct: ["lawType"],
    });

    // Find policies needing updates
    const updates: {
      policyId: string;
      policyType: string;
      currentVersion: string | null;
      newVersion: string;
      lawType: string;
      description: string;
      effectiveDate: Date;
    }[] = [];

    for (const policy of policies) {
      const relevantLaws = latestVersions.filter((lv) => {
        // Map policy types to relevant law types
        if (policy.type === "privacy") {
          return ["gdpr", "ccpa", "cpra"].includes(lv.lawType);
        }
        if (policy.type === "cookies") {
          return ["gdpr", "eprivacy"].includes(lv.lawType);
        }
        return false;
      });

      for (const law of relevantLaws) {
        if (policy.lawVersion !== law.version) {
          updates.push({
            policyId: policy.id,
            policyType: policy.type,
            currentVersion: policy.lawVersion,
            newVersion: law.version,
            lawType: law.lawType,
            description: law.description,
            effectiveDate: law.effectiveDate,
          });
        }
      }
    }

    return NextResponse.json({ updates });
  } catch (error) {
    console.error("Get law updates error:", error);
    return NextResponse.json({ error: "Failed to get updates" }, { status: 500 });
  }
}

// Create a new law version (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Check if user is admin
    const body = await request.json();
    const { lawType, version, description, requirements, effectiveDate } = body;

    const lawVersion = await prisma.lawVersion.create({
      data: {
        lawType,
        version,
        description,
        requirements: requirements || {},
        effectiveDate: new Date(effectiveDate),
      },
    });

    return NextResponse.json({ lawVersion });
  } catch (error) {
    console.error("Create law version error:", error);
    return NextResponse.json({ error: "Failed to create law version" }, { status: 500 });
  }
}
