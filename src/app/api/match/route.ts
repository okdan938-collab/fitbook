import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { rankTrainerMatches } from "@/lib/match";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const athlete = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!athlete) return NextResponse.json({ error: "Athlete not found" }, { status: 404 });

  const sport = new URL(request.url).searchParams.get("sport") || undefined;

  const trainers = await prisma.user.findMany({
    where: {
      role: "TRAINER"
    },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      trainerProfile: {
        select: {
          id: true,
          sports: true,
          experience: true
        }
      }
    }
  });

  const results = rankTrainerMatches({ athlete, trainers, sport });
  return NextResponse.json(results);
}
