import express from 'express';
import {
    addItem, addTable, getAllRestaurants, getCart, getOrders, getTableNumbers, removeItem,
    requestAssistance, sendOrder, tableSelect, tableDeselect, getTables, getOrdersItems, removeTable

} from '../controllers/tableController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// Used in CustomerSelectScreen.jsx
router.put('/:restaurantId/select', tableSelect);

// Used in CustomerMenuScreen.jsx
router.put('/:restaurantId/deselect', tableDeselect);

// Used in CustomerSelectScreen.jsx
router.get('/:restaurantId/numbers', getTableNumbers);

// Used in TableScreen.jsx
router.post('/:restaurantId/add', addTable);
router.delete('/:restaurantId/remove', removeTable);
router.get('/:restaurantId/tables', getTables);

// Used in CustomerMenuScreen.jsx
router.post('/:restaurantId/:tableId/assistance', requestAssistance);

// Used in CustomerItemModal.jsx
router.post('/:restaurantId/:tableId/:itemId/addItem', addItem);

// Used in CartScreen.jsx
router.delete('/:restaurantId/:tableId/:cartItemId/removeItem', removeItem);
router.get('/:restaurantId/:tableId/cart', getCart);

// Unused ///////////
router.get('/:restaurantId/:tableId/orders', getOrders);

// Used in OrderScreen.jsx
router.get('/:restaurantId/:tableId/orders/items', getOrdersItems);

// Used in CustomerSelectScreen.jsx
router.get('/restaurants', getAllRestaurants);

// Used in CartScreen.jsx
router.post('/:restaurantId/:tableId/sendOrder', sendOrder);

// Used in TasksScreen.jsx, GET http://localhost:5000/tables/:restaurantId/assistance???


export default router;