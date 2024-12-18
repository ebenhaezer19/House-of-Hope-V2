import { PrismaClient, Resident, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export class ResidentService {
  async findAll(query: any) {
    try {
      console.log('[Service] findAll called with query:', query);

      const residents = await prisma.resident.findMany({
        include: {
          documents: true,
          room: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      console.log(`[Service] Found ${residents.length} residents`);
      return residents
    } catch (error) {
      console.error('[Service] Error in findAll:', error)
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
      throw new Error('Penghuni tidak ditemukan')
    }

    return resident
  }

  async create(data: Prisma.ResidentCreateInput) {
    try {
      return await prisma.resident.create({
        data,
        include: {
          documents: true,
          room: true
        }
      })
    } catch (error) {
      console.error('Error in create:', error)
      throw error
    }
  }

  async update(id: number, data: Prisma.ResidentUpdateInput) {
    try {
      return await prisma.resident.update({
        where: { id },
        data,
        include: {
          documents: true,
          room: true
        }
      })
    } catch (error) {
      console.error('Error in update:', error)
      throw error
    }
  }

  async delete(id: number) {
    try {
      // Hapus dokumen terkait terlebih dahulu
      await prisma.document.deleteMany({
        where: { residentId: id }
      })

      // Kemudian hapus resident
      return await prisma.resident.delete({
        where: { id }
      })
    } catch (error) {
      console.error('Error in delete:', error)
      throw error
    }
  }
} 