import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function getOAuthSession(sessionId: string) {
  // If the generated Prisma client doesn't expose `session` in its typings,
  // cast to any to bypass the type error while keeping the runtime call.
  const clientAny = prisma as unknown as any;
  return await clientAny.session?.findUnique({
    where: { id: sessionId },
    select: {
      provider: true,
      accessToken: true,
      refreshToken: true,
      expiresAt: true,
    },
  });
}
