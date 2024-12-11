import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class RoomController {
  async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await prisma.room.findMany({
        include: {
          residents: true
        },
        orderBy: [
          { floor: 'asc' },
          { number: 'asc' }
        ]
      })

      const formattedRooms = rooms.map(room => ({
        id: room.id,
        number: room.number,
        type: room.type,
        capacity: room.capacity,
        floor: room.floor,
        gender: room.number.startsWith('L') ? 'Laki-laki' : 'Perempuan',
        description: room.description,
        occupied: room.residents.length,
        available: room.capacity - room.residents.length,
        status: room.residents.length < room.capacity ? 'Tersedia' : 'Penuh'
      }))

      res.json(formattedRooms)
    } catch (error: any) {
      console.error('Error getting rooms:', error)
      res.status(500).json({ message: error.message })
    }
  }
} 