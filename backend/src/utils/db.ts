import { PrismaClient } from '@prisma/client';

// Creating a singleton instance of the Prisma Client
const prisma = new PrismaClient();

// Exporting the Prisma Client instance
export default prisma;
