import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class RoomController {
  async getAllRooms(_req: Request, res: Response) {
    try {
      const rooms = await prisma.room.findMany({
        include: {
          residents: true
        }
      });
      return res.json(rooms);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting rooms' });
    }
  }
} 