import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { FavoriteButton } from "@/components/FavoriteButton";
import { ReviewForm } from "@/components/ReviewForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TrainerProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  const trainer = await prisma.trainerProfile.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { reviewer: true }
      }
    }
  });

  if (!trainer) notFound();

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_trainerId: {
        userId: session.user.id,
        trainerId: trainer.id
      }
    }
  });

  const averageRating =
    trainer.reviews.length > 0
      ? trainer.reviews.reduce((acc, review) => acc + review.rating, 0) / trainer.reviews.length
      : 0;

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <article className="card">
        <h1>{trainer.user.name || "Trainer"}</h1>
        {trainer.isVerified ? <span className="badge">Verified Trainer</span> : null}
        <p>{trainer.bio}</p>
        <p>
          <strong>Sports:</strong> {trainer.sports.join(", ")}
        </p>
        <p>
          <strong>Experience:</strong> {trainer.experience}
        </p>
        <p>
          <strong>Price:</strong> ${(trainer.hourlyPriceCents / 100).toFixed(2)}/hr
        </p>
        <p>
          <strong>Average Rating:</strong> {averageRating.toFixed(1)} ({trainer.reviews.length} total)
        </p>
        <FavoriteButton trainerId={trainer.id} initialFavorite={Boolean(favorite)} />
      </article>

      <ReviewForm trainerId={trainer.id} />

      <article className="card">
        <h2>Recent Reviews</h2>
        {trainer.reviews.length === 0 ? <p>No reviews yet.</p> : null}
        {trainer.reviews.map((review) => (
          <div key={review.id} style={{ borderTop: "1px solid #d9e1e8", paddingTop: "0.7rem", marginTop: "0.7rem" }}>
            <strong>{review.rating}/5</strong>
            <p>{review.comment}</p>
            <small>By {review.reviewer.name || "Athlete"}</small>
          </div>
        ))}
      </article>
    </section>
  );
}
