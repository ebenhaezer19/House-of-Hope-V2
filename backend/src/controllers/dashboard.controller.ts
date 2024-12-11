import { Request, Response } from 'express'
import { dashboardService } from '../services/dashboard.service'

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await dashboardService.getStats()
      res.json(stats)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getGenderDistribution(req: Request, res: Response) {
    try {
      const data = await dashboardService.getGenderDistribution()
      res.json(data)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getEducationDistribution(req: Request, res: Response) {
    try {
      const data = await dashboardService.getEducationDistribution()
      res.json(data)
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
      const data = await dashboardService.getRoomOccupancy()
      res.json(data)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
}

export const dashboardController = new DashboardController() 