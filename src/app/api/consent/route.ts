import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

// Log consent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { policyId, consentGiven, visitorId } = body;

    if (!policyId || !consentGiven) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get policy's org
    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
      select: { orgId: true },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Get IP and user agent (for compliance record)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create consent record
    const record = await prisma.consentRecord.create({
      data: {
        orgId: policy.orgId,
        visitorId: visitorId || nanoid(),
        consentGiven,
        ipAddress: ip,
        userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      recordId: record.id,
      visitorId: record.visitorId,
    });
  } catch (error) {
    console.error("Consent log error:", error);
    return NextResponse.json({ error: "Failed to log consent" }, { status: 500 });
  }
}

// Get consent records for org (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json({ error: "Missing orgId" }, { status: 400 });
    }

    // TODO: Add auth check for org access

    const records = await prisma.consentRecord.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const stats = await prisma.consentRecord.groupBy({
      by: ["consentGiven"],
      where: { orgId },
      _count: true,
    });

    return NextResponse.json({ records, stats });
  } catch (error) {
    console.error("Get consent error:", error);
    return NextResponse.json({ error: "Failed to get consent records" }, { status: 500 });
  }
}
