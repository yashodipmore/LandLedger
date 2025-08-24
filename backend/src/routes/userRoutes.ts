import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

// Placeholder routes - will be implemented
router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'User routes - Under development'
  });
});

export default router;
