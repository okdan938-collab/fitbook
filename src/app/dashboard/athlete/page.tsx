import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AthleteDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  const trainers = await prisma.trainerProfile.findMany({
    include: {
      user: true,
      reviews: true
    },
    take: 12,
    orderBy: { updatedAt: "desc" }
  });

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <h1>Athlete Dashboard</h1>
      <p>Browse nearby trainers and compare by sport, rating, and price.</p>
      <div className="grid two">
        {trainers.map((trainer) => {
          const avgRating =
            trainer.reviews.length > 0
              ? trainer.reviews.reduce((acc, review) => acc + review.rating, 0) / trainer.reviews.length
              : 0;

          return (
            <article key={trainer.id} className="card">
              <h3>{trainer.user.name || "Trainer"}</h3>
              <p>{trainer.bio}</p>
              <p>
                <strong>Sports:</strong> {trainer.sports.join(", ")}
              </p>
              <p>
                <strong>Price:</strong> ${(trainer.hourlyPriceCents / 100).toFixed(2)}/hr
              </p>
              <p>
                <strong>Rating:</strong> {avgRating.toFixed(1)} ({trainer.reviews.length} reviews)
              </p>
              {trainer.isVerified ? <span className="badge">Verified</span> : null}
              <div style={{ marginTop: "0.65rem", display: "flex", gap: "0.5rem" }}>
                <Link className="button" href={`/trainer/${trainer.id}`}>
                  View Profile
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
