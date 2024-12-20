import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all payments with resident data
export const getPayments = async (req: Request, res: Response) => {
  try {
    const { residentId } = req.query;
    console.log('Getting payments with query:', { residentId });

    // Ambil data resident terlebih dahulu jika ada residentId
    if (residentId) {
      const resident = await prisma.resident.findUnique({
        where: { id: Number(residentId) },
        include: {
          room: true,
          payments: {
            orderBy: { date: 'desc' }
          }
        }
      });

      if (!resident) {
        return res.status(404).json({ message: 'Resident tidak ditemukan' });
      }

      // Return payments dari resident
      return res.json(resident.payments.map(payment => ({
        ...payment,
        resident: {
          id: resident.id,
          name: resident.name,
          room: resident.room
        }
      })));
    }

    // Jika tidak ada residentId, ambil semua payments dengan join
    const payments = await prisma.payment.findMany({
      include: {
        resident: {
          include: {
            room: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    console.log(`Found ${payments.length} payments`);
    res.json(payments);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data pembayaran',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Getting payment with ID:', id);

    // Pastikan ID valid
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ 
        message: 'ID pembayaran tidak valid',
        received: id 
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { 
        id: Number(id) 
      },
      include: {
        resident: {
          include: {
            room: true
          }
        }
      }
    });

    if (!payment) {
      console.log('Payment not found with ID:', id);
      return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }

    console.log('Found payment:', payment);
    res.json(payment);
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({ message: 'Gagal mengambil data pembayaran' });
  }
};

// Create payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    console.log('Creating payment with data:', req.body);
    
    const { residentId, amount, type, status, notes } = req.body;

    // Validasi input
    if (!residentId || !amount || !type || !status) {
      return res.status(400).json({ 
        message: 'Data tidak lengkap',
        received: { residentId, amount, type, status, notes }
      });
    }

    const payment = await prisma.payment.create({
      data: {
        residentId: Number(residentId),
        amount: Number(amount),
        type,
        status,
        notes,
        date: new Date()
      },
      include: {
        resident: true
      }
    });

    console.log('Payment created:', payment);
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ 
      message: 'Gagal membuat pembayaran baru',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update payment
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, type, status, notes } = req.body;
    
    console.log('Updating payment:', { id, body: req.body });

    // Validasi ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ 
        message: 'ID pembayaran tidak valid',
        received: id 
      });
    }

    // Validasi input
    if (!amount || !type || !status) {
      return res.status(400).json({ 
        message: 'Data tidak lengkap',
        received: { amount, type, status, notes }
      });
    }

    // Cek apakah payment ada
    const existingPayment = await prisma.payment.findUnique({
      where: { id: Number(id) }
    });

    if (!existingPayment) {
      console.log('Payment not found with ID:', id);
      return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }

    // Update payment
    const payment = await prisma.payment.update({
      where: { 
        id: Number(id) 
      },
      data: {
        amount: Number(amount),
        type,
        status,
        notes: notes || ''
      },
      include: {
        resident: {
          include: {
            room: true
          }
        }
      }
    });

    console.log('Payment updated:', payment);
    res.json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ 
      message: 'Gagal mengupdate pembayaran',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete payment
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.payment.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Pembayaran berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Gagal menghapus pembayaran' });
  }
};