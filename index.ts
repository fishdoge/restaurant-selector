import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const r = await prisma.restaurant.create({
    data: {
      name: 'Prisma Cafe',
      mapUrl: 'https://goo.gl/maps/...',
    }}
  )
  const rs = await prisma.restaurant.findMany()
  console.log(rs)
}

main()