import { Request, Response } from 'express'
import { RoomService } from '../services/room.service'

const roomService = new RoomService()

export class RoomController {
  async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await roomService.findAll()
      res.json(rooms)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async createRoom(req: Request, res: Response) {
    try {
      const room = await roomService.create(req.body)
      res.status(201).json(room)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async getRoom(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const room = await roomService.findOne(id)
      res.json(room)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  }

  async updateRoom(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const room = await roomService.update(id, req.body)
      res.json(room)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async deleteRoom(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const room = await roomService.delete(id)
      res.json(room)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
} 