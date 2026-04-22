"use client";

import { FormEvent, useState } from "react";

export function RoleSelector({ currentRole }: { currentRole: "ATHLETE" | "TRAINER" }) {
  const [role, setRole] = useState(currentRole);
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");

    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role })
    });

    setStatus(response.ok ? "Saved. Opening dashboard..." : "Failed to save role.");

    if (response.ok) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h1>Choose Your Role</h1>
      <p>This controls your FitBook dashboard and available features.</p>
      <label>Role</label>
      <select value={role} onChange={(e) => setRole(e.target.value as "ATHLETE" | "TRAINER")}> 
        <option value="ATHLETE">Athlete</option>
        <option value="TRAINER">Trainer</option>
      </select>
      <button type="submit">Save Role</button>
      {status ? <p>{status}</p> : null}
    </form>
  );
}
