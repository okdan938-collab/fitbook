import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { RoleSelector } from "@/components/RoleSelector";
import { authOptions } from "@/lib/auth";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const role = session.user.role === Role.TRAINER ? "TRAINER" : "ATHLETE";
  return <RoleSelector currentRole={role} />;
}
