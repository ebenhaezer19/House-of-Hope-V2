import { z } from 'zod'

export const createRoomSchema = z.object({
  number: z.string().min(1, 'Nomor kamar harus diisi'),
  type: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: 'Tipe kamar harus MALE atau FEMALE' })
  }),
  capacity: z.number({
    required_error: 'Kapasitas harus diisi',
    invalid_type_error: 'Kapasitas harus berupa angka'
  }).min(1, 'Kapasitas minimal 1')
})

export const updateRoomSchema = createRoomSchema.partial()

export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type UpdateRoomInput = z.infer<typeof updateRoomSchema> 