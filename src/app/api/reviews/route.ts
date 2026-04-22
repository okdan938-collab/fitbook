import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  trainerId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3)
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review payload" }, { status: 400 });
  }

  const review = await prisma.review.upsert({
    where: {
      reviewerId_trainerId: {
        reviewerId: session.user.id,
        trainerId: parsed.data.trainerId
      }
    },
    create: {
      reviewerId: session.user.id,
      trainerId: parsed.data.trainerId,
      rating: parsed.data.rating,
      comment: parsed.data.comment
    },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment
    }
  });

  return NextResponse.json(review);
}
