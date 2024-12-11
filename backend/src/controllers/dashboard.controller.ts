import { Request, Response } from 'express'
import { DashboardService } from '../services/dashboard.service'

const dashboardService = new DashboardService()

export class DashboardController {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await dashboardService.getStats()
      res.json(stats)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getResidentsByGender(req: Request, res: Response) {
    try {
      const stats = await dashboardService.getResidentsByGender()
      res.json(stats)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getResidentsByEducation(req: Request, res: Response) {
    try {
      const stats = await dashboardService.getResidentsByEducation()
      res.json(stats)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getRecentResidents(req: Request, res: Response) {
    try {
      const residents = await dashboardService.getRecentResidents()
      res.json(residents)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getRoomOccupancy(req: Request, res: Response) {
    try {
      const occupancy = await dashboardService.getRoomOccupancy()
      res.json(occupancy)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
} 