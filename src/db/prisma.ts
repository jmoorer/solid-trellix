import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
console.log({ env: process.env });
process.on("beforeExit", () => {
  prisma.$disconnect();
});

export { prisma };
