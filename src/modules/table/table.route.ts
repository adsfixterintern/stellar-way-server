import express from 'express';
import { upload } from '../../app/config/cloudinary.config';
import { TableController } from './table.controller';

const router = express.Router();

router.post('/create-table',upload.single('image'), TableController.createTable);
router.get('/', TableController.getAllTables);
router.get('/:id', TableController.getSingleTable);
router.patch('/:id', upload.single('image'), TableController.updateTable);
router.delete('/:id', TableController.deleteTable);

export const TableRoutes = router;