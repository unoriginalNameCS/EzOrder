import express from 'express';
import { getOrders, setOrderInProgress, setOrderPrepared, viewOrderNotes } from '../controllers/orderController.js';

const router = express.Router();

router.get('/:restaurantId/orders', getOrders);
router.put('/:restaurantId/orders', setOrderInProgress);
router.put('/:restaurantId/orders', setOrderPrepared);
router.get('/:restaurantId/orders/:orderId', viewOrderNotes);

export default router;