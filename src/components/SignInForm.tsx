"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard"
    });

    if (response?.error) {
      setError("Invalid credentials");
    }
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <label>Email</label>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password</label>
      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      <button type="submit">Sign In</button>
      <p>
        New here? <a href="/auth/signup">Create account</a>
      </p>
      <div style={{ marginTop: "0.8rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button className="secondary" type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Continue with Google
        </button>
        <button className="secondary" type="button" onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}>
          Continue with Apple
        </button>
      </div>
    </form>
  );
}
