import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="hero">
        <article className="card">
          <h1>Find Verified Local Trainers, Fast</h1>
          <p>
            FitBook helps athletes discover trusted, multi-sport trainers nearby with clear pricing,
            credible profiles, and real reviews.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a className="button" href={session ? "/dashboard" : "/auth/signin"}>
              Find a Trainer
            </a>
            <a className="button secondary" href={session ? "/onboarding" : "/auth/signin"}>
              Become a Trainer
            </a>
          </div>
        </article>
        <article className="card">
          <h2>Why FitBook</h2>
          <ul>
            <li>Role-specific athlete and trainer dashboards</li>
            <li>Stripe subscription unlock for trainer tools</li>
            <li>Location + sport matching foundation</li>
            <li>Reviews and favorites for trust</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
