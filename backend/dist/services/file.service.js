"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FileService {
    constructor() {
        this.uploadDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(this.uploadDir)) {
            fs_1.default.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async uploadFile(file) {
        try {
            const filename = `${Date.now()}-${file.originalname}`;
            const filepath = path_1.default.join(this.uploadDir, filename);
            await fs_1.default.promises.writeFile(filepath, file.buffer);
            return {
                originalname: file.originalname,
                filename,
                path: `/uploads/${filename}`,
                mimetype: file.mimetype
            };
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Gagal mengupload file');
        }
    }
    async deleteFile(filename) {
        try {
            const filepath = path_1.default.join(this.uploadDir, filename);
            if (fs_1.default.existsSync(filepath)) {
                await fs_1.default.promises.unlink(filepath);
            }
        }
        catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('Gagal menghapus file');
        }
    }
}
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map