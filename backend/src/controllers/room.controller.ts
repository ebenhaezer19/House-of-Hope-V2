import { Request, Response } from 'express'
import { RoomService } from '../services/room.service'

const roomService = new RoomService()

export class RoomController {
  // Get all rooms
  async getAll(req: Request, res: Response) {
    try {
      const result = await roomService.findAll(req.query)
      res.json(result)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  // Get one room
  async getOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const room = await roomService.findOne(id)
      res.json(room)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  }

  // Create room
  async create(req: Request, res: Response) {
    try {
      const room = await roomService.create(req.body)
      res.status(201).json(room)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  // Update room
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const room = await roomService.update(id, req.body)
      res.json(room)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  // Delete room
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const room = await roomService.delete(id)
      res.json(room)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  // Check room availability
  async checkAvailability(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const availability = await roomService.checkAvailability(id)
      res.json(availability)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  }
} 