import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default prisma
//Generates a new prisma client and exports it. This avoids multiple prisma client instances running at once.