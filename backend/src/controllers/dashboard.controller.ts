import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export class DashboardController {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getStats(req: Request, res: Response) {
    try {
      const [totalResidents, totalRooms, totalUsers] = await Promise.all([
        this.prisma.resident.count(),
        this.prisma.room.count(),
        this.prisma.user.count()
      ])

      res.json({
        totalResidents,
        totalRooms,
        totalUsers
      })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getResidentsByGender(req: Request, res: Response) {
    try {
      const stats = await this.prisma.resident.groupBy({
        by: ['gender'],
        _count: true
      })

      res.json(stats)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getRoomsOccupancy(req: Request, res: Response) {
    try {
      const rooms = await this.prisma.room.findMany({
        include: {
          _count: {
            select: { residents: true }
          }
        }
      })

      const occupancy = rooms.map(room => ({
        number: room.number,
        capacity: room.capacity,
        occupied: room._count.residents
      }))

      res.json(occupancy)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getRecentActivities(req: Request, res: Response) {
    try {
      const activities = await this.prisma.resident.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true
        }
      })

      res.json(activities)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
} 