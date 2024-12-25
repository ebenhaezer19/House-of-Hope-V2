import { z } from 'zod'

export const residentSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  nik: z.string().min(16, 'NIK harus 16 digit').max(16),
  birthPlace: z.string().min(1, 'Tempat lahir harus diisi'),
  birthDate: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  address: z.string().min(1, 'Alamat harus diisi'),
  phone: z.string().optional(),
  education: z.enum(['TK', 'SD', 'SMP', 'SMA', 'KULIAH', 'MAGANG']),
  schoolName: z.string().min(1, 'Nama sekolah harus diisi'),
  grade: z.string().optional(),
  major: z.string().optional(),
  assistance: z.enum(['YAYASAN', 'DIAKONIA']),
  details: z.string().optional(),
  roomId: z.number().int().positive()
})

export const updateResidentSchema = residentSchema.partial()

export type CreateResidentInput = z.infer<typeof residentSchema>
export type UpdateResidentInput = z.infer<typeof updateResidentSchema> 