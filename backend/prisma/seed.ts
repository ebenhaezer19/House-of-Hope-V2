import { PrismaClient, RoomType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@houseofhope.com' },
    update: {},
    create: {
      email: 'admin@houseofhope.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  })

  // Seed rooms
  const rooms = [
    {
      number: 'L1',
      type: 'WARD' as RoomType,
      capacity: 20,
      floor: 1,
      description: 'Kamar Laki-laki 1'
    },
    {
      number: 'L2',
      type: 'WARD' as RoomType,
      capacity: 20,
      floor: 1,
      description: 'Kamar Laki-laki 2'
    },
    {
      number: 'P1',
      type: 'WARD' as RoomType,
      capacity: 20,
      floor: 2,
      description: 'Kamar Perempuan 1'
    },
    {
      number: 'P2',
      type: 'WARD' as RoomType,
      capacity: 20,
      floor: 2,
      description: 'Kamar Perempuan 2'
    }
  ]

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { number: room.number },
      update: {
        type: room.type,
        capacity: room.capacity,
        floor: room.floor,
        description: room.description
      },
      create: {
        number: room.number,
        type: room.type,
        capacity: room.capacity,
        floor: room.floor,
        description: room.description
      }
    })
  }

  console.log({ admin })
  console.log('Rooms seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 