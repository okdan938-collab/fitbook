import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  sport: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  verifiedOnly: z.coerce.boolean().optional()
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    sport: url.searchParams.get("sport") || undefined,
    minPrice: url.searchParams.get("minPrice") || undefined,
    maxPrice: url.searchParams.get("maxPrice") || undefined,
    verifiedOnly: url.searchParams.get("verifiedOnly") || undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const trainers = await prisma.trainerProfile.findMany({
    where: {
      sports: parsed.data.sport ? { has: parsed.data.sport } : undefined,
      hourlyPriceCents: {
        gte: parsed.data.minPrice ? Math.round(parsed.data.minPrice * 100) : undefined,
        lte: parsed.data.maxPrice ? Math.round(parsed.data.maxPrice * 100) : undefined
      },
      isVerified: parsed.data.verifiedOnly ? true : undefined
    },
    include: {
      user: true,
      reviews: true
    },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json(trainers);
}
