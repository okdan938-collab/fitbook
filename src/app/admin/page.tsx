import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  if (session.user.role !== Role.ADMIN) redirect("/dashboard");

  const [users, pendingSubs, unverifiedTrainers] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "PAST_DUE" } }),
    prisma.trainerProfile.count({ where: { isVerified: false } })
  ]);

  return (
    <section className="grid two">
      <article className="card">
        <h2>Total Users</h2>
        <p>{users}</p>
      </article>
      <article className="card">
        <h2>Past Due Subscriptions</h2>
        <p>{pendingSubs}</p>
      </article>
      <article className="card">
        <h2>Unverified Trainers</h2>
        <p>{unverifiedTrainers}</p>
      </article>
    </section>
  );
}
