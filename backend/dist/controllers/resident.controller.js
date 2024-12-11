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
exports.ResidentController = void 0;
const resident_service_1 = require("../services/resident.service");
const file_service_1 = require("../services/file.service");
const residentService = new resident_service_1.ResidentService();
const fileService = new file_service_1.FileService();
class ResidentController {
    getAllResidents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield residentService.findAll(req.query);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getResident(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const resident = yield residentService.findOne(id);
                res.json(resident);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    createResident(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                const documents = [];
                if (files && files.length > 0) {
                    for (const file of files) {
                        const uploaded = yield fileService.uploadFile(file);
                        documents.push({
                            filename: file.originalname,
                            path: uploaded.url,
                            type: file.mimetype
                        });
                    }
                }
                const data = Object.assign({ name: req.body.name, nik: req.body.nik, birthplace: req.body.birthplace, birthdate: new Date(req.body.birthdate), gender: req.body.gender, address: req.body.address, phone: req.body.phone || null, education: req.body.education, schoolName: req.body.schoolName, grade: req.body.grade || null, major: req.body.major || null, assistance: req.body.assistance, details: req.body.details || null, room: {
                        connect: { id: parseInt(req.body.roomId) }
                    } }, (documents.length > 0 && {
                    documents: {
                        create: documents
                    }
                }));
                const resident = yield residentService.create(data);
                res.status(201).json(resident);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updateResident(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const files = req.files;
                const documents = [];
                if (files && files.length > 0) {
                    for (const file of files) {
                        const uploaded = yield fileService.uploadFile(file);
                        documents.push({
                            filename: file.originalname,
                            path: uploaded.url,
                            type: file.mimetype
                        });
                    }
                }
                const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (req.body.name && { name: req.body.name })), (req.body.nik && { nik: req.body.nik })), (req.body.birthplace && { birthplace: req.body.birthplace })), (req.body.birthdate && { birthdate: new Date(req.body.birthdate) })), (req.body.gender && { gender: req.body.gender })), (req.body.address && { address: req.body.address })), (req.body.phone !== undefined && { phone: req.body.phone })), (req.body.education && { education: req.body.education })), (req.body.schoolName && { schoolName: req.body.schoolName })), (req.body.grade !== undefined && { grade: req.body.grade })), (req.body.major !== undefined && { major: req.body.major })), (req.body.assistance && { assistance: req.body.assistance })), (req.body.details !== undefined && { details: req.body.details })), (req.body.roomId && {
                    room: {
                        connect: { id: parseInt(req.body.roomId) }
                    }
                })), (documents.length > 0 && {
                    documents: {
                        create: documents
                    }
                }));
                const resident = yield residentService.update(id, updateData);
                res.json(resident);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deleteResident(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const resident = yield residentService.delete(id);
                res.json(resident);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.ResidentController = ResidentController;
