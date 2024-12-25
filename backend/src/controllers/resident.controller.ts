import { Request, Response } from 'express'
import { ResidentService } from '../services/resident.service'
import { PrismaClient, ResidentStatus } from '@prisma/client'

const residentService = new ResidentService()
const prisma = new PrismaClient()

export class ResidentController {
  async getAllResidents(req: Request, res: Response) {
    try {
      console.log('Fetching all residents...');
      const residents = await prisma.resident.findMany({
        include: {
          room: true,
          documents: true,
          payments: {
            orderBy: {
              date: 'desc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      console.log(`Found ${residents.length} residents`);
      return res.json(residents);
    } catch (error) {
      console.error('Error getting residents:', error);
      return res.status(500).json({ message: 'Gagal mengambil data penghuni' });
    }
  }

  async getResident(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resident = await prisma.resident.findUnique({
        where: { id: Number(id) },
        include: {
          room: true,
          documents: true
        }
      });
      
      if (!resident) {
        return res.status(404).json({ message: 'Resident not found' });
      }
      
      return res.json(resident);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting resident' });
    }
  }

  async createResident(req: Request, res: Response) {
    try {
      let data = JSON.parse(req.body.data);
      
      // Validasi status
      if (!Object.values(ResidentStatus).includes(data.status)) {
        throw new Error(`Invalid status: ${data.status}`);
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

      const resident = await prisma.resident.create({
        data: residentData,
        include: {
          room: true
        }
      });

      return res.status(201).json({
        message: 'Resident created successfully',
        data: resident
      });

    } catch (error: any) {
      return res.status(400).json({
        message: 'Error creating resident',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async updateResident(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = JSON.parse(req.body.data);
      
      const updatedResident = await residentService.update(parseInt(id), data);
      return res.json(updatedResident);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating resident' });
    }
  }

  async deleteResident(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.resident.delete({
        where: { id: Number(id) }
      });
      return res.json({ message: 'Resident deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting resident' });
    }
  }
} 