"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResidentController = void 0;
const resident_service_1 = require("../services/resident.service");
const client_1 = require("@prisma/client");
const residentService = new resident_service_1.ResidentService();
const prisma = new client_1.PrismaClient();
class ResidentController {
    async getAllResidents(_req, res) {
        try {
            const residents = await prisma.resident.findMany({
                include: {
                    room: true,
                    documents: true
                }
            });
            return res.json(residents);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error getting residents' });
        }
    }
    async getResident(req, res) {
        try {
            const { id } = req.params;
            const resident = await prisma.resident.findUnique({
                where: { id: Number(id) },
                include: {
                    room: true,
                    documents: true
                }
            });
            if (!resident) {
                return res.status(404).json({ message: 'Resident not found' });
            }
            return res.json(resident);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error getting resident' });
        }
    }
    async createResident(req, res) {
        try {
            let data = JSON.parse(req.body.data);
            if (!Object.values(client_1.ResidentStatus).includes(data.status)) {
                throw new Error(`Invalid status: ${data.status}`);
            }
            const residentData = Object.assign({ name: data.name, nik: data.nik, birthPlace: data.birthPlace, birthDate: data.birthDate, gender: data.gender, address: data.address, phone: data.phone || null, education: data.education, schoolName: data.schoolName, grade: data.grade || null, major: data.major || null, assistance: data.assistance, details: data.details || null, roomId: parseInt(data.roomId), status: data.status, createdAt: new Date(data.createdAt) }, (data.status === client_1.ResidentStatus.ALUMNI ? {
                exitDate: new Date(data.exitDate),
                alumniNotes: data.alumniNotes
            } : {
                exitDate: null,
                alumniNotes: null
            }));
            const resident = await prisma.resident.create({
                data: residentData,
                include: {
                    room: true
                }
            });
            return res.status(201).json({
                message: 'Resident created successfully',
                data: resident
            });
        }
        catch (error) {
            return res.status(400).json({
                message: 'Error creating resident',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    async updateResident(req, res) {
        try {
            const { id } = req.params;
            const data = JSON.parse(req.body.data);
            const updatedResident = await residentService.update(parseInt(id), data);
            return res.json(updatedResident);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error updating resident' });
        }
    }
    async deleteResident(req, res) {
        try {
            const { id } = req.params;
            await prisma.resident.delete({
                where: { id: Number(id) }
            });
            return res.json({ message: 'Resident deleted successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Error deleting resident' });
        }
    }
}
exports.ResidentController = ResidentController;
//# sourceMappingURL=resident.controller.js.map