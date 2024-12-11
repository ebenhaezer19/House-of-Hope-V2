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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResidentService = void 0;
const client_1 = require("@prisma/client");
class ResidentService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (query = {}) {
            return this.prisma.resident.findMany({
                include: {
                    room: true,
                    documents: true
                }
            });
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.resident.findUnique({
                where: { id },
                include: {
                    room: true,
                    documents: true
                }
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.resident.create({
                data,
                include: {
                    room: true,
                    documents: true
                }
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.resident.update({
                where: { id },
                data,
                include: {
                    room: true,
                    documents: true
                }
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.resident.delete({
                where: { id }
            });
        });
    }
}
exports.ResidentService = ResidentService;
