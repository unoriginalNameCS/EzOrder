import express from 'express';
import {
    addItem,
    addTable,
    getAllRestaurants,
    getCart, getOrders, getPendingRequestsForAssistance,
    getTableNumbers,
    removeItem,
    requestAssistance,
    sendOrder,
    tableSelect,
    updateRequestsForAssistance,
    tableDeselect,
    getTables
} from '../controllers/tableController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.put('/:restaurantId/select', tableSelect);
router.put('/:restaurantId/deselect', tableDeselect);
router.get('/:restaurantId/numbers', getTableNumbers);
router.post('/:restaurantId/add', addTable);
router.get('/:restaurantId/tables', getTables)
router.post('/:restaurantId/:tableId/assistance', requestAssistance);
router.post('/:restaurantId/:tableId/:itemId/addItem', addItem);
router.delete('/:restaurantId/:tableId/:cartItemId/removeItem', removeItem);
router.get('/:restaurantId/:tableId/cart', getCart);
router.get('/:restaurantId/:tableId/orders', getOrders);
router.get('/:restaurantId/assistance', getPendingRequestsForAssistance)
router.patch('/assistance', updateRequestsForAssistance)
router.get('/restaurants', getAllRestaurants);
router.post('/:restaurantId/:tableId/sendOrder', sendOrder);

export default router;