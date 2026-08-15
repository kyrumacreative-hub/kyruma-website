import { PrismaClient } from "@prisma/client";

const prismaGlobal = globalThis as typeof globalThis & { kyrumaPrisma?: PrismaClient };

export const prisma = prismaGlobal.kyrumaPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") prismaGlobal.kyrumaPrisma = prisma;

