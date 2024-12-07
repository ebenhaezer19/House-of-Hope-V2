import { PrismaClient, Resident } from '@prisma/client'

const prisma = new PrismaClient()

export class ResidentService {
  // Create
  async create(data: Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.resident.create({
      data,
      include: {
        room: true,
        documents: true
      }
    })
  }

  // Read All
  async findAll(query: any = {}) {
    const { page = 1, limit = 10, search = '', ...filters } = query
    const skip = (page - 1) * limit

    const where = {
      OR: search ? [
        { name: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search, mode: 'insensitive' } }
      ] : undefined,
      ...filters
    }

    const [residents, total] = await Promise.all([
      prisma.resident.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          room: true,
          documents: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.resident.count({ where })
    ])

    return {
      data: residents,
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
    const resident = await prisma.resident.findUnique({
      where: { id },
      include: {
        room: true,
        documents: true
      }
    })

    if (!resident) {
      throw new Error('Resident not found')
    }

    return resident
  }

  // Update
  async update(id: number, data: Partial<Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>>) {
    const resident = await prisma.resident.findUnique({ where: { id } })
    if (!resident) {
      throw new Error('Resident not found')
    }

    return prisma.resident.update({
      where: { id },
      data,
      include: {
        room: true,
        documents: true
      }
    })
  }

  // Delete
  async delete(id: number) {
    const resident = await prisma.resident.findUnique({ where: { id } })
    if (!resident) {
      throw new Error('Resident not found')
    }

    return prisma.resident.delete({
      where: { id },
      include: {
        room: true,
        documents: true
      }
    })
  }
} 