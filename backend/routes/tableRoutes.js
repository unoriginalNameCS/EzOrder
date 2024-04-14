import express from 'express';
import {
    addItem, addTable, getAllRestaurants, getCart, getTableNumbers, removeItem,
    requestAssistance, sendOrder, tableSelect, tableDeselect, getTables, getOrdersItems, removeTable

} from '../controllers/tableController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.put('/:restaurantId/select', tableSelect);
router.put('/:restaurantId/deselect', tableDeselect);
router.get('/:restaurantId/numbers', getTableNumbers);
router.post('/:restaurantId/add', addTable);
router.delete('/:restaurantId/remove', removeTable);
router.get('/:restaurantId/tables', getTables);
router.post('/:restaurantId/:tableId/assistance', requestAssistance);
router.post('/:restaurantId/:tableId/:itemId/addItem', addItem);
router.delete('/:restaurantId/:tableId/:cartItemId/removeItem', removeItem);
router.get('/:restaurantId/:tableId/cart', getCart);
router.get('/:restaurantId/:tableId/orders/items', getOrdersItems);
router.get('/restaurants', getAllRestaurants);
router.post('/:restaurantId/:tableId/sendOrder', sendOrder);


export default router;