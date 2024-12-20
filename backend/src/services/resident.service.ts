import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ResidentService {
  async findAll() {
    try {
      const residents = await prisma.resident.findMany({
        include: {
          documents: true,
          room: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return residents
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number) {
    const resident = await prisma.resident.findUnique({
      where: { id },
      include: {
        documents: true,
        room: true
      }
    })

    if (!resident) {
      throw new Error('Resident not found')
    }

    return resident
  }

  async create(data: any) {
    try {
      return await prisma.resident.create({
        data,
        include: {
          documents: true,
          room: true
        }
      })
    } catch (error) {
      throw error
    }
  }

  async update(id: number, data: any) {
    return await prisma.resident.update({
      where: { id },
      data,
      include: {
        room: true,
        documents: true
      }
    })
  }

  async delete(id: number) {
    try {
      // Delete related documents first
      await prisma.document.deleteMany({
        where: { residentId: id }
      })

      // Then delete the resident
      return await prisma.resident.delete({
        where: { id }
      })
    } catch (error) {
      throw error
    }
  }
} 