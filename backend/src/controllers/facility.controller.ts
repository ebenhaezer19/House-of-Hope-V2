import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FacilityController {
  // Get all facilities
  async getAllFacilities(req: Request, res: Response) {
    try {
      const facilities = await prisma.facility.findMany({
        include: {
          bookings: {
            where: {
              startTime: {
                lte: new Date()
              },
              endTime: {
                gte: new Date()
              }
            },
            include: {
              resident: true
            }
          },
          maintenanceLogs: {
            where: {
              status: 'in_progress'
            }
          }
        }
      });

      res.json(facilities);
    } catch (error) {
      console.error('Error getting facilities:', error);
      res.status(500).json({ message: 'Gagal mengambil data fasilitas' });
    }
  }

  // Create facility
  async createFacility(req: Request, res: Response) {
    try {
      const { name, type, capacity, status, image, description, location, maintenanceSchedule } = req.body;

      const facility = await prisma.facility.create({
        data: {
          name,
          type,
          capacity: parseInt(capacity),
          status,
          image,
          description,
          location,
          maintenanceSchedule
        }
      });

      res.status(201).json(facility);
    } catch (error) {
      console.error('Error creating facility:', error);
      res.status(500).json({ message: 'Gagal membuat fasilitas baru' });
    }
  }

  // Create booking
  async createBooking(req: Request, res: Response) {
    try {
      const { facilityId, residentId, startTime, endTime, purpose, notes } = req.body;

      // Check if facility is available
      const existingBookings = await prisma.booking.findMany({
        where: {
          facilityId: parseInt(facilityId),
          OR: [
            {
              AND: [
                { startTime: { lte: new Date(startTime) } },
                { endTime: { gte: new Date(startTime) } }
              ]
            },
            {
              AND: [
                { startTime: { lte: new Date(endTime) } },
                { endTime: { gte: new Date(endTime) } }
              ]
            }
          ]
        }
      });

      if (existingBookings.length > 0) {
        return res.status(400).json({ message: 'Fasilitas sudah dibooking untuk waktu tersebut' });
      }

      const booking = await prisma.booking.create({
        data: {
          facilityId: parseInt(facilityId),
          residentId: parseInt(residentId),
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          purpose,
          notes,
          status: 'pending'
        },
        include: {
          facility: true,
          resident: true
        }
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Gagal membuat booking' });
    }
  }

  // Create maintenance log
  async createMaintenanceLog(req: Request, res: Response) {
    try {
      const { facilityId, type, description, startDate, status, notes } = req.body;

      const maintenanceLog = await prisma.maintenanceLog.create({
        data: {
          facilityId: parseInt(facilityId),
          type,
          description,
          startDate: new Date(startDate),
          status,
          notes
        },
        include: {
          facility: true
        }
      });

      // Update facility status if maintenance is starting
      if (status === 'in_progress') {
        await prisma.facility.update({
          where: { id: parseInt(facilityId) },
          data: { status: 'maintenance' }
        });
      }

      res.status(201).json(maintenanceLog);
    } catch (error) {
      console.error('Error creating maintenance log:', error);
      res.status(500).json({ message: 'Gagal membuat log maintenance' });
    }
  }
} 