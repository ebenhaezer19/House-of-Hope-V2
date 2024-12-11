"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filename = `${Date.now()}-${file.originalname}`;
                const filepath = path_1.default.join(this.uploadDir, filename);
                yield fs_1.default.promises.writeFile(filepath, file.buffer);
                return {
                    filename,
                    url: `/uploads/${filename}`,
                    mimetype: file.mimetype
                };
            }
            catch (error) {
                console.error('File upload failed:', error);
                throw error;
            }
        });
    }
}
exports.FileService = FileService;
