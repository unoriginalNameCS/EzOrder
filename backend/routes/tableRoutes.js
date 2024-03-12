import express from 'express';
import { tableSelect, getTableNumbers, addTable } from '../controllers/tableController.js';


const router = express.Router();

router.post('/:restaurantId/select', tableSelect)
router.get('/:restaurantId/numbers', getTableNumbers)
router.post('/:restaurantId/add', addTable)

export default router;