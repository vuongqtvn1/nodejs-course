import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function PrismaQuery() {
  const users = await prisma.user.findMany()
  console.log(users)
}

PrismaQuery()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
