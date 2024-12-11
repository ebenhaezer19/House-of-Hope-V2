"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResidentSchema = exports.createResidentSchema = void 0;
const zod_1 = require("zod");
exports.createResidentSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nama minimal 3 karakter'),
    nik: zod_1.z.string().length(16, 'NIK harus 16 digit'),
    birthplace: zod_1.z.string().min(3, 'Tempat lahir minimal 3 karakter'),
    birthdate: zod_1.z.string().datetime('Format tanggal lahir tidak valid'),
    gender: zod_1.z.enum(['MALE', 'FEMALE'], {
        errorMap: () => ({ message: 'Gender harus MALE atau FEMALE' })
    }),
    address: zod_1.z.string().min(10, 'Alamat minimal 10 karakter'),
    phone: zod_1.z.string().optional(),
    education: zod_1.z.enum(['TK', 'SD', 'SMP', 'SMA', 'KULIAH', 'MAGANG'], {
        errorMap: () => ({ message: 'Pendidikan tidak valid' })
    }),
    schoolName: zod_1.z.string().min(3, 'Nama sekolah minimal 3 karakter'),
    grade: zod_1.z.string().optional(),
    major: zod_1.z.string().optional(),
    assistance: zod_1.z.enum(['YAYASAN', 'DIAKONIA'], {
        errorMap: () => ({ message: 'Jenis bantuan tidak valid' })
    }),
    details: zod_1.z.string().optional(),
    roomId: zod_1.z.number({
        required_error: 'Room ID harus diisi',
        invalid_type_error: 'Room ID harus berupa angka'
    })
});
exports.updateResidentSchema = exports.createResidentSchema.partial();
//# sourceMappingURL=resident.schema.js.map