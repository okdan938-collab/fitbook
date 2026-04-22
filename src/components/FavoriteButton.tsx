"use client";

import { useState } from "react";

export function FavoriteButton({ trainerId, initialFavorite }: { trainerId: string; initialFavorite: boolean }) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);

  async function toggleFavorite() {
    setBusy(true);
    const method = favorite ? "DELETE" : "POST";
    const response = await fetch("/api/favorites", {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ trainerId })
    });

    if (response.ok) setFavorite(!favorite);
    setBusy(false);
  }

  return (
    <button className="secondary" onClick={toggleFavorite} disabled={busy}>
      {favorite ? "Saved" : "Save Trainer"}
    </button>
  );
}
