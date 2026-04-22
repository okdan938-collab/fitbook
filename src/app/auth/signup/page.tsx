"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Creating account...");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      setStatus("Signup failed. Try another email or stronger password.");
      return;
    }

    await signIn("credentials", { email, password, callbackUrl: "/onboarding" });
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h1>Create Account</h1>
      <label>Name</label>
      <input required value={name} onChange={(e) => setName(e.target.value)} />
      <label>Email</label>
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password (min 8 chars)</label>
      <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
      {status ? <p>{status}</p> : null}
    </form>
  );
}
