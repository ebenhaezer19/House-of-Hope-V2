import { Request, Response } from 'express'
import { ResidentService } from '../services/resident.service'
import { FileService } from '../services/file.service'
import { Prisma } from '@prisma/client'
import { UploadedFile } from '../types/file.types'
import { ResidentStatus } from '@prisma/client'

const residentService = new ResidentService()
const fileService = new FileService()

export class ResidentController {
  async getAllResidents(req: Request, res: Response) {
    try {
      const residents = await prisma.resident.findMany({
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          exitDate: true,
          gender: true,
          education: true,
          assistance: true
        }
      });

      res.json(residents);
    } catch (error) {
      console.error('Error fetching residents:', error);
      res.status(500).json({ message: 'Gagal mengambil data penghuni' });
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
      let data = JSON.parse(req.body.data);
      
      // Validasi status
      if (!Object.values(ResidentStatus).includes(data.status)) {
        throw new Error(`Status tidak valid: ${data.status}`);
      }

      // Format data dengan status yang benar
      const residentData = {
        name: data.name,
        nik: data.nik,
        birthPlace: data.birthPlace,
        birthDate: data.birthDate,
        gender: data.gender,
        address: data.address,
        phone: data.phone || null,
        education: data.education,
        schoolName: data.schoolName,
        grade: data.grade || null,
        major: data.major || null,
        assistance: data.assistance,
        details: data.details || null,
        roomId: parseInt(data.roomId),
        status: data.status as ResidentStatus,
        createdAt: new Date(data.createdAt),
        ...(data.status === ResidentStatus.ALUMNI ? {
          exitDate: new Date(data.exitDate),
          alumniNotes: data.alumniNotes
        } : {
          exitDate: null,
          alumniNotes: null
        })
      };

      console.log('Creating resident with data:', {
        name: residentData.name,
        status: residentData.status,
        exitDate: residentData.exitDate
      });

      const resident = await prisma.resident.create({
        data: residentData,
        include: {
          room: true
        }
      });

      // Kirim response yang lebih sederhana
      res.status(201).json({
        message: 'Data penghuni berhasil ditambahkan',
        data: {
          id: resident.id,
          name: resident.name,
          status: resident.status,
          exitDate: resident.exitDate
        }
      });

    } catch (error) {
      console.error('Error creating resident:', error);
      res.status(400).json({ 
        message: 'Gagal membuat data penghuni',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async updateResident(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data = JSON.parse(req.body.data)
      
      // Handle file uploads
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      
      const updatedResident = await residentService.update(parseInt(id), {
        ...data,
        // Update other fields as needed
      })

      res.json(updatedResident)
    } catch (error) {
      console.error('Error updating resident:', error)
      res.status(500).json({ message: 'Gagal memperbarui data penghuni' })
    }
  }

  async deleteResident(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID tidak valid' });
      }

      // Cek apakah resident ada
      const resident = await prisma.resident.findUnique({
        where: { id }
      });

      if (!resident) {
        return res.status(404).json({ message: 'Data penghuni tidak ditemukan' });
      }

      // Hapus dokumen terkait terlebih dahulu
      await prisma.document.deleteMany({
        where: { residentId: id }
      });

      // Hapus data penghuni
      await prisma.resident.delete({
        where: { id }
      });

      res.json({ 
        message: 'Data penghuni berhasil dihapus',
        deletedId: id 
      });

    } catch (error) {
      console.error('Error deleting resident:', error);
      res.status(500).json({ 
        message: 'Gagal menghapus data penghuni',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
} 