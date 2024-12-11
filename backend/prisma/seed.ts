import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash password admin
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Buat user admin default
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

  console.log({ admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 