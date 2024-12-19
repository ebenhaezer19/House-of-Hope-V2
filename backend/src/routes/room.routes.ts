import express from 'express';
import { RoomController } from '../controllers/room.controller';

const router = express.Router();
const roomController = new RoomController();

router.get('/', roomController.getAllRooms);

export default router; 