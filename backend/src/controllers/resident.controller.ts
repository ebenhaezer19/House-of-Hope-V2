import { Request, Response } from 'express'
import { ResidentService } from '../services/resident.service'
import { FileService } from '../services/file.service'
import { Prisma } from '@prisma/client'

const residentService = new ResidentService()
const fileService = new FileService()

export class ResidentController {
  async getAllResidents(req: Request, res: Response) {
    try {
      const result = await residentService.findAll(req.query)
      res.json(result)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async getResident(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const resident = await residentService.findOne(id)
      res.json(resident)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  }

  async createResident(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[]
      const documents = []

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

      const data: Prisma.ResidentCreateInput = {
        name: req.body.name,
        nik: req.body.nik,
        birthPlace: req.body.birthPlace,
        birthDate: new Date(req.body.birthDate),
        gender: req.body.gender,
        address: req.body.address,
        phone: req.body.phone || null,
        education: req.body.education,
        schoolName: req.body.schoolName,
        grade: req.body.grade || null,
        major: req.body.major || null,
        assistance: req.body.assistance,
        details: req.body.details || null,
        room: {
          connect: { id: parseInt(req.body.roomId) }
        },
        ...(documents.length > 0 && {
          documents: {
            create: documents
          }
        })
      }

      const resident = await residentService.create(data)
      res.status(201).json(resident)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateResident(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const files = req.files as Express.Multer.File[]
      const documents = []

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

      const updateData: Prisma.ResidentUpdateInput = {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.nik && { nik: req.body.nik }),
        ...(req.body.birthplace && { birthplace: req.body.birthplace }),
        ...(req.body.birthdate && { birthdate: new Date(req.body.birthdate) }),
        ...(req.body.gender && { gender: req.body.gender }),
        ...(req.body.address && { address: req.body.address }),
        ...(req.body.phone !== undefined && { phone: req.body.phone }),
        ...(req.body.education && { education: req.body.education }),
        ...(req.body.schoolName && { schoolName: req.body.schoolName }),
        ...(req.body.grade !== undefined && { grade: req.body.grade }),
        ...(req.body.major !== undefined && { major: req.body.major }),
        ...(req.body.assistance && { assistance: req.body.assistance }),
        ...(req.body.details !== undefined && { details: req.body.details }),
        ...(req.body.roomId && {
          room: {
            connect: { id: parseInt(req.body.roomId) }
          }
        }),
        ...(documents.length > 0 && {
          documents: {
            create: documents
          }
        })
      }

      const resident = await residentService.update(id, updateData)
      res.json(resident)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async deleteResident(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const resident = await residentService.delete(id)
      res.json(resident)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
} 