"use client";

import { FormEvent, useState } from "react";

export function TrainerProfileEditor(props: {
  bio?: string;
  sports?: string[];
  experience?: string;
  hourlyPriceCents?: number;
}) {
  const [bio, setBio] = useState(props.bio ?? "");
  const [sports, setSports] = useState((props.sports ?? []).join(", "));
  const [experience, setExperience] = useState(props.experience ?? "");
  const [hourlyPrice, setHourlyPrice] = useState(String((props.hourlyPriceCents ?? 5000) / 100));
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving profile...");

    const response = await fetch("/api/trainer/profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bio,
        sports: sports
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience,
        hourlyPriceCents: Math.round(Number(hourlyPrice) * 100)
      })
    });

    setStatus(response.ok ? "Profile saved." : "Could not save profile.");
  }

  async function onSubscribe() {
    setStatus("Opening Stripe checkout...");
    const response = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setStatus("Unable to open checkout.");
  }

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <form className="card" onSubmit={onSubmit}>
        <h2>Trainer Profile</h2>
        <label>Bio</label>
        <textarea required value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        <label>Sports (comma separated)</label>
        <input required value={sports} onChange={(e) => setSports(e.target.value)} placeholder="Basketball, Football" />
        <label>Experience</label>
        <input required value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Beginner to Advanced" />
        <label>Hourly Price (USD)</label>
        <input required value={hourlyPrice} onChange={(e) => setHourlyPrice(e.target.value)} />
        <button type="submit">Save Trainer Profile</button>
      </form>
      <article className="card">
        <h2>Become a Paid Trainer</h2>
        <p>$7.99/month unlocks trainer marketplace visibility and dashboard features.</p>
        <button onClick={onSubscribe}>Subscribe with Stripe</button>
      </article>
      {status ? <p>{status}</p> : null}
    </div>
  );
}
