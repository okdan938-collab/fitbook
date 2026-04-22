import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitBook",
  description: "Find and book trusted local multi-sport trainers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <a className="logo" href="/">
            FitBook
          </a>
          <nav>
            <a href="/about">About</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/auth/signin">Sign In</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
