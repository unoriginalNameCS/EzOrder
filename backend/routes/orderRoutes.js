import express from 'express';
import { getCompletedOrders, getOrders, getPendingOrders, getPreparingOrders, setOrderInProgress, setOrderPrepared, viewOrderNotes } from '../controllers/orderController.js';

const router = express.Router();

router.get('/:restaurantId/orders', getOrders);
router.put('/:restaurantId/orders', setOrderInProgress);
router.put('/:restaurantId/orders', setOrderPrepared);
router.get('/:restaurantId/orders/:orderId', viewOrderNotes);
router.get('/:restaurantId/pendingOrders', getPendingOrders);
router.get('/:restaurantId/preparingOrders', getPreparingOrders);
router.get('/:restaurantId/completedOrders', getCompletedOrders);

export default router;