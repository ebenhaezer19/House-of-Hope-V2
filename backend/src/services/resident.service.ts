import { PrismaClient, Resident, Prisma } from '@prisma/client'

export class ResidentService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async findAll(query: any = {}): Promise<Resident[]> {
    return this.prisma.resident.findMany({
      include: {
        room: true,
        documents: true
      }
    })
  }

  async findOne(id: number): Promise<Resident | null> {
    return this.prisma.resident.findUnique({
      where: { id },
      include: {
        room: true,
        documents: true
      }
    })
  }

  async create(data: Prisma.ResidentCreateInput): Promise<Resident> {
    // Validasi data
    if (!data.name || !data.nik || !data.birthPlace || !data.birthDate || 
        !data.gender || !data.address || !data.education || !data.schoolName || 
        !data.assistance || !data.room?.connect?.id) {
      throw new Error('Data tidak lengkap')
    }

    // Validasi dan konversi tanggal
    let birthDate: Date
    try {
      birthDate = new Date(data.birthDate)
      if (isNaN(birthDate.getTime())) {
        throw new Error('Format tanggal lahir tidak valid')
      }
    } catch (error) {
      throw new Error('Format tanggal lahir tidak valid')
    }

    // Validasi room exists
    const roomId = data.room?.connect?.id
    if (!roomId) {
      throw new Error('ID kamar tidak valid')
    }

    const room = await this.prisma.room.findUnique({
      where: { id: roomId }
    })

    if (!room) {
      throw new Error('Kamar tidak ditemukan')
    }

    // Validasi room capacity
    const currentOccupants = await this.prisma.resident.count({
      where: { roomId: room.id }
    })

    if (currentOccupants >= room.capacity) {
      throw new Error('Kamar sudah penuh')
    }

    // Create resident dengan data yang sudah divalidasi
    const createData = {
      ...data,
      birthDate: birthDate.toISOString(), // Pastikan format tanggal benar
      room: {
        connect: { id: roomId }
      }
    }

    return this.prisma.resident.create({
      data: createData,
      include: {
        room: true,
        documents: true
      }
    })
  }

  async update(id: number, data: Prisma.ResidentUpdateInput): Promise<Resident> {
    return this.prisma.resident.update({
      where: { id },
      data,
      include: {
        room: true,
        documents: true
      }
    })
  }

  async delete(id: number): Promise<Resident> {
    return this.prisma.resident.delete({
      where: { id }
    })
  }
} 