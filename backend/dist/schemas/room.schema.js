"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomSchema = exports.createRoomSchema = void 0;
const zod_1 = require("zod");
exports.createRoomSchema = zod_1.z.object({
    number: zod_1.z.string().min(1, 'Nomor kamar harus diisi'),
    type: zod_1.z.enum(['MALE', 'FEMALE'], {
        errorMap: () => ({ message: 'Tipe kamar harus MALE atau FEMALE' })
    }),
    capacity: zod_1.z.number({
        required_error: 'Kapasitas harus diisi',
        invalid_type_error: 'Kapasitas harus berupa angka'
    }).min(1, 'Kapasitas minimal 1')
});
exports.updateRoomSchema = exports.createRoomSchema.partial();
//# sourceMappingURL=room.schema.js.map