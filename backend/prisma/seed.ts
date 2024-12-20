import { PrismaClient, RoomType, Gender, Education, AssistanceType, ResidentStatus } from '@prisma/client'
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

  // Seed rooms if none exist
  const roomCount = await prisma.room.count();
  
  if (roomCount === 0) {
    const rooms = [
      {
        number: 'L1',
        type: RoomType.WARD,
        capacity: 20,
        floor: 1,
        description: 'Kamar Laki-laki 1'
      },
      {
        number: 'L2',
        type: RoomType.WARD,
        capacity: 20,
        floor: 1,
        description: 'Kamar Laki-laki 2'
      },
      {
        number: 'P1',
        type: RoomType.WARD,
        capacity: 20,
        floor: 2,
        description: 'Kamar Perempuan 1'
      },
      {
        number: 'P2',
        type: RoomType.WARD,
        capacity: 20,
        floor: 2,
        description: 'Kamar Perempuan 2'
      }
    ];

    for (const room of rooms) {
      await prisma.room.create({ data: room });
    }
    
    console.log('Rooms seeded successfully');
  }

  // Cek apakah sudah ada resident
  const residentCount = await prisma.resident.count();
  
  if (residentCount === 0) {
    // Buat resident contoh
    const resident = await prisma.resident.create({
      data: {
        name: "John Doe",
        nik: "1234567890123456",
        birthPlace: "Jakarta",
        birthDate: "2000-01-01",
        gender: Gender.MALE,
        address: "Jl. Contoh No. 123",
        phone: "081234567890",
        education: Education.SMA,
        schoolName: "SMA Negeri 1",
        assistance: AssistanceType.YAYASAN,
        status: ResidentStatus.ACTIVE,
        roomId: 1, // Pastikan room dengan ID 1 sudah ada
        details: "Contoh resident untuk testing"
      }
    });
    
    console.log('Test resident created:', resident);

    // Buat payment untuk resident yang baru dibuat
    const payment = await prisma.payment.create({
      data: {
        residentId: resident.id,
        amount: 500000,
        type: "MONTHLY",
        status: "PAID",
        notes: "Pembayaran bulan Januari 2024",
        date: new Date(),
      },
    });

    console.log('Test payment created:', payment);
  } else {
    // Jika sudah ada resident, gunakan ID resident yang pertama
    const firstResident = await prisma.resident.findFirst();
    
    if (firstResident) {
      const payment = await prisma.payment.create({
        data: {
          residentId: firstResident.id,
          amount: 500000,
          type: "MONTHLY",
          status: "PAID",
          notes: "Pembayaran bulan Januari 2024",
          date: new Date(),
        },
      });

      console.log('Payment created for existing resident:', payment);
    }
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