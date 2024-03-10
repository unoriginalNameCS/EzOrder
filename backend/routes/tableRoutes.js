import express from 'express';
import { tableSelect, getTableNumbers } from '../controllers/tableController.js';


const router = express.Router();

router.post('/table', tableSelect)
router.get('/table/numbers', getTableNumbers)

export default router;