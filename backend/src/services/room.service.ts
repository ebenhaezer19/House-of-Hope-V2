import { PrismaClient, Room } from '@prisma/client'

const prisma = new PrismaClient()

export class RoomService {
  // Create
  async create(data: Omit<Room, 'id'>) {
    return prisma.room.create({
      data,
      include: {
        residents: true
      }
    })
  }

  // Read All
  async findAll(query: any = {}) {
    const { page = 1, limit = 10, search = '', type } = query
    const skip = (page - 1) * limit

    const where = {
      AND: [
        search ? {
          number: { contains: search, mode: 'insensitive' }
        } : {},
        type ? { type } : {}
      ]
    }

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          residents: true
        },
        orderBy: {
          number: 'asc'
        }
      }),
      prisma.room.count({ where })
    ])

    // Tambahkan informasi okupansi
    const roomsWithOccupancy = rooms.map(room => ({
      ...room,
      occupancy: room.residents.length,
      isAvailable: room.residents.length < room.capacity
    }))

    return {
      data: roomsWithOccupancy,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    }
  }

  // Read One
  async findOne(id: number) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        residents: true
      }
    })

    if (!room) {
      throw new Error('Kamar tidak ditemukan')
    }

    return {
      ...room,
      occupancy: room.residents.length,
      isAvailable: room.residents.length < room.capacity
    }
  }

  // Update
  async update(id: number, data: Partial<Omit<Room, 'id'>>) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        residents: true
      }
    })

    if (!room) {
      throw new Error('Kamar tidak ditemukan')
    }

    // Cek jika kapasitas baru lebih kecil dari jumlah penghuni
    if (data.capacity && data.capacity < room.residents.length) {
      throw new Error('Kapasitas baru tidak boleh lebih kecil dari jumlah penghuni saat ini')
    }

    return prisma.room.update({
      where: { id },
      data,
      include: {
        residents: true
      }
    })
  }

  // Delete
  async delete(id: number) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        residents: true
      }
    })

    if (!room) {
      throw new Error('Kamar tidak ditemukan')
    }

    if (room.residents.length > 0) {
      throw new Error('Tidak dapat menghapus kamar yang masih memiliki penghuni')
    }

    return prisma.room.delete({
      where: { id },
      include: {
        residents: true
      }
    })
  }

  // Check availability
  async checkAvailability(id: number) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        residents: true
      }
    })

    if (!room) {
      throw new Error('Kamar tidak ditemukan')
    }

    return {
      room,
      occupancy: room.residents.length,
      isAvailable: room.residents.length < room.capacity,
      remainingCapacity: room.capacity - room.residents.length
    }
  }
} 