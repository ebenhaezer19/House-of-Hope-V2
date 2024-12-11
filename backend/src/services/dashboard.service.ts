import { prisma } from '../lib/prisma'

interface GenderCount {
  gender: string
  count: number
}

interface EducationCount {
  education: string
  count: number
}

interface RoomOccupancy {
  roomNumber: string
  capacity: number
  occupied: number
  available: number
}

export class DashboardService {
  async getStats() {
    const totalResidents = await prisma.resident.count()
    const totalRooms = await prisma.room.count()
    const maleResidents = await prisma.resident.count({
      where: { room: { type: 'MALE' } }
    })
    const femaleResidents = await prisma.resident.count({
      where: { room: { type: 'FEMALE' } }
    })

    return {
      totalResidents,
      totalRooms,
      maleResidents,
      femaleResidents
    }
  }

  async getGenderDistribution(): Promise<GenderCount[]> {
    const residents = await prisma.resident.groupBy({
      by: ['gender'],
      _count: true
    })

    return residents.map((item: any) => ({
      gender: item.gender,
      count: item._count
    }))
  }

  async getEducationDistribution(): Promise<EducationCount[]> {
    const residents = await prisma.resident.groupBy({
      by: ['education'],
      _count: true
    })

    return residents.map((item: any) => ({
      education: item.education,
      count: item._count
    }))
  }

  async getRecentResidents() {
    return prisma.resident.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        room: true
      }
    })
  }

  async getRoomOccupancy(): Promise<RoomOccupancy[]> {
    const rooms = await prisma.room.findMany({
      include: {
        _count: {
          select: { residents: true }
        }
      }
    })

    return rooms.map((room: any) => ({
      roomNumber: room.number,
      capacity: room.capacity,
      occupied: room._count.residents,
      available: room.capacity - room._count.residents
    }))
  }
}

export const dashboardService = new DashboardService() 