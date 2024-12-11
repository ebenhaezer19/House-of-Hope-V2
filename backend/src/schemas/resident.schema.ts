import { z } from 'zod'

export const createResidentSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  nik: z.string().length(16, 'NIK harus 16 digit'),
  birthplace: z.string().min(3, 'Tempat lahir minimal 3 karakter'),
  birthdate: z.string().datetime('Format tanggal lahir tidak valid'),
  gender: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: 'Gender harus MALE atau FEMALE' })
  }),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  phone: z.string().optional(),
  
  // Pendidikan
  education: z.enum(['TK', 'SD', 'SMP', 'SMA', 'KULIAH', 'MAGANG'], {
    errorMap: () => ({ message: 'Pendidikan tidak valid' })
  }),
  schoolName: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  grade: z.string().optional(),
  major: z.string().optional(),
  
  // Bantuan
  assistance: z.enum(['YAYASAN', 'DIAKONIA'], {
    errorMap: () => ({ message: 'Jenis bantuan tidak valid' })
  }),
  details: z.string().optional(),
  
  // Relasi
  roomId: z.number({
    required_error: 'Room ID harus diisi',
    invalid_type_error: 'Room ID harus berupa angka'
  })
})

export const updateResidentSchema = createResidentSchema.partial()

export type CreateResidentInput = z.infer<typeof createResidentSchema>
export type UpdateResidentInput = z.infer<typeof updateResidentSchema> 