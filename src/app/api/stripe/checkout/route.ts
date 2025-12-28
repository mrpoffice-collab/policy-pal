import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
  });
}

function getPrices() {
  return {
    pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_pro_monthly",
    pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "price_pro_yearly",
    business_monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || "price_business_monthly",
    business_yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || "price_business_yearly",
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const stripe = getStripe();
    const PRICES = getPrices();

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orgId, plan, interval } = body;

    if (!orgId || !plan || !interval) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify access to org
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: { subscription: true },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (org.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Only the owner can manage billing" }, { status: 403 });
    }

    // Get or create Stripe customer
    let customerId = org.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          orgId,
          userId: session.user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID
      await prisma.subscription.update({
        where: { orgId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Get price ID
    const priceKey = `${plan}_${interval}` as keyof ReturnType<typeof getPrices>;
    const priceId = PRICES[priceKey];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/settings/billing?canceled=true`,
      metadata: {
        orgId,
        plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
