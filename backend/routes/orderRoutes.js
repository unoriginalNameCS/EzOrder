import express from 'express';
import { getCompletedOrders, getOrders, getPendingOrders, getPreparingOrders, setOrderInProgress, setOrderPrepared, viewOrderNotes, getOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/:restaurantId/orders', getOrders);
router.put('/:restaurantId/:orderId/inProgress', setOrderInProgress);
router.put('/:restaurantId/:orderId/prepared', setOrderPrepared);
// router.get('/:restaurantId/orders/:orderId', viewOrderNotes);
router.get('/:restaurantId/pendingOrders', getPendingOrders);
router.get('/:restaurantId/preparingOrders', getPreparingOrders);
router.get('/:restaurantId/completedOrders', getCompletedOrders);
router.get('/:restaurantId/orders/:orderId', getOrder)

export default router;