import express from 'express';
import { tableSelect, getTableNumbers, addTable, requestAssistance, addItem, removeItem, getCart, getOrders } from '../controllers/tableController.js';

const router = express.Router();

router.post('/:restaurantId/select', tableSelect);
router.get('/:restaurantId/numbers', getTableNumbers);
router.post('/:restaurantId/add', addTable);
router.post('/:restaurantId/:tableId/assistance', requestAssistance);
router.post(':restaurantId/:tableId/:itemId/addItem', addItem);
router.delete(':restaurantId/:tableId/:itemId/removeItem', removeItem);
router.get('/:restaurantId/:tableId/cart', getCart);
router.get('/:restaurantId/:tableId/orders', getOrders);

export default router;