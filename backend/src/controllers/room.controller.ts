import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class RoomController {
  async getAllRooms(req: Request, res: Response) {
    try {
      // Ambil semua kamar dengan data penghuni yang aktif
      const rooms = await prisma.room.findMany({
        include: {
          residents: {
            where: {
              status: {
                not: 'ALUMNI' // Hanya ambil yang bukan alumni
              }
            },
            select: {
              id: true,
              name: true,
              status: true,
              gender: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc' // Urutkan berdasarkan tanggal masuk
            }
          }
        },
        orderBy: [
          { floor: 'asc' },
          { number: 'asc' }
        ]
      })

      // Hitung statistik untuk setiap kamar
      const roomsWithStats = rooms.map(room => {
        const activeResidents = room.residents.length; // Karena sudah difilter di query
        return {
          ...room,
          availableSpace: room.capacity - activeResidents,
          occupancy: activeResidents,
          occupancyRate: (activeResidents / room.capacity) * 100,
          residents: room.residents.map(resident => ({
            ...resident,
            statusLabel: resident.status === 'NEW' ? 'Baru' : 'Aktif'
          }))
        }
      })

      res.json(roomsWithStats)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      res.status(500).json({ message: 'Gagal mengambil data kamar' })
    }
  }
} 