import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const PRISMA_CLIENT_REV = 12;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaRev?: number;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL n'est pas définie.");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function resolvePrismaClient(): PrismaClient {
  if (globalForPrisma.prisma && globalForPrisma.prismaRev === PRISMA_CLIENT_REV) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  globalForPrisma.prismaRev = PRISMA_CLIENT_REV;
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const client = resolvePrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
