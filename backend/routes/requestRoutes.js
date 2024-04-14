import express from 'express';
import { getRequests, setRequestAssisting, setRequestComplete } from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Used in Header.jsx and WaiterTableReqScreen.jsx
router.get('/:restaurantId/requests', getRequests);

// Used in RequestProgressButton.jsx
router.put('/:restaurantId/:requestId/assisting', setRequestAssisting);
router.put('/:restaurantId/:requestId/complete', setRequestComplete);

export default router;