import { SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.STRIPE_TRAINER_MONTHLY_PRICE_ID) {
    return NextResponse.json({ error: "Missing plan price id" }, { status: 500 });
  }

  const existing = await prisma.subscription.findUnique({ where: { userId: session.user.id } });

  const stripe = getStripe();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/trainer?subscribed=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/trainer?canceled=1`,
    line_items: [{ price: process.env.STRIPE_TRAINER_MONTHLY_PRICE_ID, quantity: 1 }],
    customer: existing?.stripeCustomerId || undefined,
    customer_email: session.user.email || undefined,
    metadata: {
      userId: session.user.id
    },
    subscription_data: {
      metadata: {
        userId: session.user.id
      }
    }
  });

  await prisma.subscription.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      status: SubscriptionStatus.INACTIVE,
      stripeCustomerId: (checkoutSession.customer as string) || null
    },
    update: {
      stripeCustomerId: (checkoutSession.customer as string) || undefined
    }
  });

  return NextResponse.json({ url: checkoutSession.url });
}
