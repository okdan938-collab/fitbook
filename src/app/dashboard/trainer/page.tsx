import { SubscriptionStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { TrainerProfileEditor } from "@/components/TrainerProfileEditor";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TrainerDashboard({
  searchParams
}: {
  searchParams: { locked?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  const profile = await prisma.trainerProfile.findUnique({ where: { userId: session.user.id } });
  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <h1>Trainer Dashboard</h1>
      {searchParams.locked === "1" || subscription?.status !== SubscriptionStatus.ACTIVE ? (
        <div className="card">
          <strong>Trainer features are locked.</strong>
          <p>Start your $7.99/month subscription to publish your profile and receive athlete leads.</p>
        </div>
      ) : (
        <div className="card">
          <strong>Subscription Active</strong>
          <p>Your trainer tools are unlocked.</p>
        </div>
      )}
      <TrainerProfileEditor
        bio={profile?.bio}
        sports={profile?.sports}
        experience={profile?.experience}
        hourlyPriceCents={profile?.hourlyPriceCents}
      />
    </section>
  );
}
