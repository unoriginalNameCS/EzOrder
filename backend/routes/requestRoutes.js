import express from 'express';
import { getRequests, setRequestAssisting, setRequestComplete } from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:restaurantId/requests', getRequests);
router.put('/:restaurantId/:requestId/assisting', setRequestAssisting);
router.put('/:restaurantId/:requestId/complete', setRequestComplete);

export default router;