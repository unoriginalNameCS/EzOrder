import express from 'express';
import { getRequests, setRequestAssisting, setRequestComplete } from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:restaurantId/requests', getRequests);
router.get('/:restaurantId/:requestId/assisting', setRequestAssisting);
router.get('/:restaurantId/:restaurantId/complete', setRequestComplete);

export default router;