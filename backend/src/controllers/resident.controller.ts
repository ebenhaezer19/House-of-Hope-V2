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
      const residents = await prisma.resident.findMany({
        select: {
          id: true,
          name: true,
          status: true,
          exitDate: true,
          createdAt: true,
          gender: true,
          education: true,
          assistance: true,
          documents: true,
          room: true
        }
      });

      // Debug log untuk memeriksa data
      console.log('Residents data:', residents.map(r => ({
        name: r.name,
        status: r.status,
        createdAt: r.createdAt,
        exitDate: r.exitDate
      })));

      res.json(residents);
    } catch (error) {
      console.error('Error fetching residents:', error);
      res.status(500).json({ 
        message: 'Gagal mengambil data penghuni',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
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
      
      // Pastikan status dan exitDate diproses dengan benar
      const residentData = {
        ...data,
        roomId: parseInt(data.roomId),
        status: data.status || 'ACTIVE',
        // Konversi exitDate ke Date jika ada
        exitDate: data.status === 'ALUMNI' && data.exitDate ? new Date(data.exitDate) : null,
        alumniNotes: data.status === 'ALUMNI' ? data.alumniNotes : null
      };

      console.log('Creating resident with data:', residentData);

      const resident = await prisma.resident.create({
        data: {
          ...residentData,
          room: {
            connect: { id: residentData.roomId }
          },
          documents: {
            create: documents
          }
        },
        include: {
          room: true,
          documents: true
        }
      });

      res.status(201).json(resident);
    } catch (error) {
      console.error('Error creating resident:', error);
      res.status(400).json({ 
        message: error.message || 'Gagal membuat data penghuni',
        error: process.env.NODE_ENV === 'development' ? error : undefined
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