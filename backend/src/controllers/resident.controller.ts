import { Request, Response } from 'express'
import { ResidentService } from '../services/resident.service'
import { FileService } from '../services/file.service'

const residentService = new ResidentService()
const fileService = new FileService()

export class ResidentController {
  // Get all residents
  async getAllResidents(req: Request, res: Response) {
    try {
      const result = await residentService.findAll(req.query)
      res.json(result)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  // Get one resident
  async getResident(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const resident = await residentService.findOne(id)
      res.json(resident)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  }

  // Create resident with documents
  async createResident(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[]
      const documents = []

      // Upload documents jika ada
      if (files && files.length > 0) {
        for (const file of files) {
          const uploaded = await fileService.uploadFile(file)
          documents.push({
            filename: file.originalname,
            path: uploaded.url,
            type: file.mimetype
          })
        }
      }

      // Create resident dengan documents
      const resident = await residentService.create({
        ...req.body,
        documents: {
          create: documents
        }
      })

      res.status(201).json(resident)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  // Update resident
  async updateResident(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const files = req.files as Express.Multer.File[]
      const documents = []

      // Upload documents jika ada
      if (files && files.length > 0) {
        for (const file of files) {
          const uploaded = await fileService.uploadFile(file)
          documents.push({
            filename: file.originalname,
            path: uploaded.url,
            type: file.mimetype
          })
        }
      }

      // Update resident dengan documents baru
      const resident = await residentService.update(id, {
        ...req.body,
        documents: documents.length > 0 ? {
          create: documents
        } : undefined
      })

      res.json(resident)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  // Delete resident
  async deleteResident(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const resident = await residentService.delete(id)
      res.json(resident)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  // Upload additional documents
  async uploadDocuments(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const files = req.files as Express.Multer.File[]
      const documents = []

      // Upload documents
      for (const file of files) {
        const uploaded = await fileService.uploadFile(file)
        documents.push({
          filename: file.originalname,
          path: uploaded.url,
          type: file.mimetype
        })
      }

      // Add documents to resident
      const resident = await residentService.update(id, {
        documents: {
          create: documents
        }
      })

      res.json(resident)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
} 