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
    return this.prisma.resident.create({
      data,
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