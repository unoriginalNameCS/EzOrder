import express from 'express';
import { getOrders, setOrderInProgress, setOrderPrepared, setOrderServed, setOrderServing, clearOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/:restaurantId/orders', getOrders);
router.put('/:restaurantId/:orderId/inProgress', setOrderInProgress);
router.put('/:restaurantId/:orderId/prepared', setOrderPrepared);
router.put('/:restaurantId/:orderId/serving', setOrderServing);
router.put('/:restaurantId/:orderId/served', setOrderServed);
router.delete('/:restaurantId/clearOrders', clearOrders);

export default router;