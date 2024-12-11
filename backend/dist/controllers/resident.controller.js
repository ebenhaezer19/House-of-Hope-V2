"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResidentController = void 0;
const resident_service_1 = require("../services/resident.service");
const file_service_1 = require("../services/file.service");
const residentService = new resident_service_1.ResidentService();
const fileService = new file_service_1.FileService();
class ResidentController {
    async getAllResidents(req, res) {
        try {
            const result = await residentService.findAll(req.query);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getResident(req, res) {
        try {
            const id = Number(req.params.id);
            const resident = await residentService.findOne(id);
            res.json(resident);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    async createResident(req, res) {
        try {
            const files = req.files;
            const documents = [];
            if (files && files.length > 0) {
                for (const file of files) {
                    const uploaded = await fileService.uploadFile(file);
                    documents.push({
                        filename: file.originalname,
                        path: uploaded.url,
                        type: file.mimetype
                    });
                }
            }
            const resident = await residentService.create(Object.assign(Object.assign({}, req.body), { documents: {
                    create: documents
                } }));
            res.status(201).json(resident);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updateResident(req, res) {
        try {
            const id = Number(req.params.id);
            const files = req.files;
            const documents = [];
            if (files && files.length > 0) {
                for (const file of files) {
                    const uploaded = await fileService.uploadFile(file);
                    documents.push({
                        filename: file.originalname,
                        path: uploaded.url,
                        type: file.mimetype
                    });
                }
            }
            const resident = await residentService.update(id, Object.assign(Object.assign({}, req.body), { documents: documents.length > 0 ? {
                    create: documents
                } : undefined }));
            res.json(resident);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteResident(req, res) {
        try {
            const id = Number(req.params.id);
            const resident = await residentService.delete(id);
            res.json(resident);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async uploadDocuments(req, res) {
        try {
            const id = Number(req.params.id);
            const files = req.files;
            const documents = [];
            for (const file of files) {
                const uploaded = await fileService.uploadFile(file);
                documents.push({
                    filename: file.originalname,
                    path: uploaded.url,
                    type: file.mimetype
                });
            }
            const resident = await residentService.update(id, {
                documents: {
                    create: documents
                }
            });
            res.json(resident);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.ResidentController = ResidentController;
//# sourceMappingURL=resident.controller.js.map