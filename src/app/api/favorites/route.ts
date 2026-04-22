import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  trainerId: z.string().min(1)
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const favorite = await prisma.favorite.upsert({
    where: {
      userId_trainerId: {
        userId: session.user.id,
        trainerId: parsed.data.trainerId
      }
    },
    create: {
      userId: session.user.id,
      trainerId: parsed.data.trainerId
    },
    update: {}
  });

  return NextResponse.json(favorite);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      trainerId: parsed.data.trainerId
    }
  });

  return NextResponse.json({ ok: true });
}
