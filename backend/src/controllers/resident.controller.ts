import { Request, Response } from 'express'
import { ResidentService } from '../services/resident.service'
import { FileService } from '../services/file.service'
import { Prisma } from '@prisma/client'
import { UploadedFile } from '../types/file.types'

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
      // Parse data JSON
      let data
      try {
        data = JSON.parse(req.body.data)
      } catch (e) {
        throw new Error('Format data tidak valid')
      }

      // Get uploaded files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      const documents: { filename: string; path: string; type: string }[] = []

      // Handle photo
      if (files.photo && files.photo[0]) {
        try {
          const photo = await fileService.uploadFile(files.photo[0])
          documents.push({
            filename: photo.originalname,
            path: photo.path,
            type: 'photo'
          })
        } catch (error) {
          console.error('Error uploading photo:', error)
          throw new Error('Gagal mengupload foto')
        }
      }

      // Handle documents
      if (files.documents) {
        for (const file of files.documents) {
          try {
            const uploaded = await fileService.uploadFile(file)
            documents.push({
              filename: uploaded.originalname,
              path: uploaded.path,
              type: 'document'
            })
          } catch (error) {
            console.error('Error uploading document:', error)
            throw new Error('Gagal mengupload dokumen')
          }
        }
      }

      // Validate required fields
      if (!data.name || !data.nik || !data.birthPlace || !data.birthDate || 
          !data.gender || !data.address || !data.education || !data.schoolName || 
          !data.assistance || !data.room?.connect?.id) {
        throw new Error('Data tidak lengkap')
      }

      // Create resident with documents
      const resident = await residentService.create({
        ...data,
        documents: {
          create: documents
        }
      })

      res.status(201).json(resident)
    } catch (error: any) {
      console.error('Error creating resident:', error)
      res.status(400).json({ 
        message: error.message || 'Gagal membuat data penghuni'
      })
    }
  }

  async updateResident(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      const documents: { filename: string; path: string; type: string }[] = []

      // Handle files
      if (files) {
        if (files.photo && files.photo[0]) {
          try {
            const photo = await fileService.uploadFile(files.photo[0])
            documents.push({
              filename: photo.originalname,
              path: photo.path,
              type: 'photo'
            })
          } catch (error) {
            console.error('Error uploading photo:', error)
            throw new Error('Gagal mengupload foto')
          }
        }

        if (files.documents) {
          for (const file of files.documents) {
            try {
              const uploaded = await fileService.uploadFile(file)
              documents.push({
                filename: uploaded.originalname,
                path: uploaded.path,
                type: 'document'
              })
            } catch (error) {
              console.error('Error uploading document:', error)
              throw new Error('Gagal mengupload dokumen')
            }
          }
        }
      }

      const updateData: Prisma.ResidentUpdateInput = {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.nik && { nik: req.body.nik }),
        ...(req.body.birthPlace && { birthPlace: req.body.birthPlace }),
        ...(req.body.birthDate && { birthDate: new Date(req.body.birthDate) }),
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
      console.error('Error updating resident:', error)
      res.status(400).json({ 
        message: error.message || 'Gagal mengupdate data penghuni'
      })
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