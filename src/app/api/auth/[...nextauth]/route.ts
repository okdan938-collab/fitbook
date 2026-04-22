import NextAuth from "next-auth";
import { NextRequest } from "next/server";

import { authOptions } from "@/lib/auth";

function getHandler() {
  return NextAuth(authOptions);
}

export async function GET(request: NextRequest, context: { params: { nextauth: string[] } }) {
  const handler = getHandler();
  return handler(request, context);
}

export async function POST(request: NextRequest, context: { params: { nextauth: string[] } }) {
  const handler = getHandler();
  return handler(request, context);
}
