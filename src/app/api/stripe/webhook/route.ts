import { SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

function toSubscriptionStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
    case "unpaid":
      return SubscriptionStatus.CANCELED;
    default:
      return SubscriptionStatus.INACTIVE;
  }
}

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing stripe signature or secret" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          status: SubscriptionStatus.ACTIVE,
          stripeCustomerId: (session.customer as string) || null,
          stripeSubscriptionId: (session.subscription as string) || null
        },
        update: {
          status: SubscriptionStatus.ACTIVE,
          stripeCustomerId: (session.customer as string) || undefined,
          stripeSubscriptionId: (session.subscription as string) || undefined
        }
      });
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted" ||
    event.type === "invoice.payment_failed"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const stripeSubscriptionId = sub.id as string;

    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId },
      data: {
        status: toSubscriptionStatus(sub.status as string),
        currentPeriodEnd: (sub as any).current_period_end
          ? new Date(((sub as any).current_period_end) * 1000
          : null
      }
    });
  }

  return NextResponse.json({ received: true });
}
