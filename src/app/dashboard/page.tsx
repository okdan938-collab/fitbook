import { Role, SubscriptionStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  if (session.user.role === Role.ATHLETE) {
    redirect("/dashboard/athlete");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id }
  });

  if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
    redirect("/dashboard/trainer?locked=1");
  }

  redirect("/dashboard/trainer");
}
