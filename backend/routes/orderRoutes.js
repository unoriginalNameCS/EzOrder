import express from 'express';
import { getOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/:restaurantId/orders', getOrders);

export default router;