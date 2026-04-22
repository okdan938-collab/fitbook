import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });
}

export function getPrisma() {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }

  return global.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrisma(), prop, receiver);
  }
});
