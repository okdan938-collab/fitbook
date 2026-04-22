"use client";

import { FormEvent, useState } from "react";

export function ReviewForm({ trainerId }: { trainerId: string }) {
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ trainerId, rating: Number(rating), comment })
    });

    if (response.ok) {
      setStatus("Review saved.");
      setComment("");
      return;
    }

    setStatus("Could not save review.");
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <h3>Leave a Review</h3>
      <label>Rating</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value="5">5</option>
        <option value="4">4</option>
        <option value="3">3</option>
        <option value="2">2</option>
        <option value="1">1</option>
      </select>
      <label>Comment</label>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={3} />
      <button type="submit">Submit Review</button>
      {status ? <p>{status}</p> : null}
    </form>
  );
}
