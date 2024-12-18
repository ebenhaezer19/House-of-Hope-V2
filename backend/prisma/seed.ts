import { PrismaClient, RoomType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...');

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
  console.log('Admin user seeded:', admin);

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
    const createdRoom = await prisma.room.upsert({
      where: { number: room.number },
      update: room,
      create: room
    })
    console.log('Room seeded:', createdRoom);
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error in seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 