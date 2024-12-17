import { PrismaClient, Resident, Prisma } from '@prisma/client'
import { FileService } from './file.service'

export class ResidentService {
  // Deklarasikan prisma sebagai properti private
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async findAll(query: any = {}): Promise<Resident[]> {
    return this.prisma.resident.findMany({
      include: {
        room: true,
        documents: true
      }
    })
  }

  async findOne(id: number): Promise<Resident | null> {
    return this.prisma.resident.findUnique({
      where: { id },
      include: {
        room: true,
        documents: true
      }
    })
  }

  async create(data: Prisma.ResidentCreateInput): Promise<Resident> {
    try {
      // Cek apakah NIK sudah ada
      const existingResident = await this.prisma.resident.findUnique({
        where: { nik: data.nik }
      })

      if (existingResident) {
        throw new Error('NIK sudah terdaftar')
      }

      // Jika NIK belum ada, lanjutkan create
      return this.prisma.resident.create({
        data,
        include: {
          room: true,
          documents: true
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('NIK sudah terdaftar')
        }
      }
      throw error
    }
  }

  async update(id: number, data: Prisma.ResidentUpdateInput): Promise<Resident> {
    return this.prisma.resident.update({
      where: { id },
      data,
      include: {
        room: true,
        documents: true
      }
    })
  }

  async delete(id: number) {
    try {
      // Cari resident dan dokumennya
      const resident = await this.prisma.resident.findUnique({
        where: { id },
        include: {
          documents: true
        }
      })

      if (!resident) {
        throw new Error('Penghuni tidak ditemukan')
      }

      // Inisialisasi FileService
      const fileService = new FileService()

      // Hapus file fisik
      for (const doc of resident.documents) {
        try {
          // Ambil nama file dari path
          const filename = doc.path.split('/').pop()
          if (filename) {
            await fileService.deleteFile(filename)
          }
        } catch (error) {
          console.error('Error deleting file:', error)
          // Lanjutkan proses meski file gagal dihapus
        }
      }

      // Hapus data dari database dalam satu transaksi
      const deleted = await this.prisma.$transaction([
        // Hapus semua dokumen
        this.prisma.document.deleteMany({
          where: { residentId: id }
        }),
        // Hapus resident
        this.prisma.resident.delete({
          where: { id }
        })
      ])

      return deleted[1] // Return deleted resident
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Gagal menghapus data: ${error.message}`)
      }
      throw new Error('Gagal menghapus data penghuni')
    }
  }
} 