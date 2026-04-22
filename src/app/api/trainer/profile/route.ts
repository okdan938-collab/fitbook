import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  bio: z.string().min(20),
  sports: z.array(z.string()).min(1),
  experience: z.string().min(3),
  hourlyPriceCents: z.number().int().positive()
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile payload" }, { status: 400 });
  }

  const profile = await prisma.trainerProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      bio: parsed.data.bio,
      sports: parsed.data.sports,
      experience: parsed.data.experience,
      hourlyPriceCents: parsed.data.hourlyPriceCents,
      certifications: [],
      mediaUrls: []
    },
    update: {
      bio: parsed.data.bio,
      sports: parsed.data.sports,
      experience: parsed.data.experience,
      hourlyPriceCents: parsed.data.hourlyPriceCents
    }
  });

  return NextResponse.json(profile);
}
