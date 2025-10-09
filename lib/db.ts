import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOAuthSession(sessionId: string) {
  return await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      provider: true,
      accessToken: true,
      refreshToken: true,
      expiresAt: true,
    },
  })
}
