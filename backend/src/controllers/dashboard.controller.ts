import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class DashboardController {
  async getStats(_req: Request, res: Response) {
    try {
      const [totalResidents, totalRooms, totalUsers] = await Promise.all([
        prisma.resident.count(),
        prisma.room.count(),
        prisma.user.count()
      ])

      res.json({
        totalResidents,
        totalRooms,
        totalUsers
      })
    } catch (error) {
      res.status(500).json({ message: 'Error getting stats' })
    }
  }

  async getResidentsByGender(_req: Request, res: Response) {
    try {
      const stats = await prisma.resident.groupBy({
        by: ['gender'],
        _count: true
      })

      res.json(stats)
    } catch (error) {
      res.status(500).json({ message: 'Error getting gender stats' })
    }
  }

  async getRoomsOccupancy(_req: Request, res: Response) {
    try {
      const rooms = await prisma.room.findMany({
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
    } catch (error) {
      res.status(500).json({ message: 'Error getting room occupancy' })
    }
  }

  async getRecentActivities(_req: Request, res: Response) {
    try {
      const activities = await prisma.resident.findMany({
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
    } catch (error) {
      res.status(500).json({ message: 'Error getting activities' })
    }
  }
} 