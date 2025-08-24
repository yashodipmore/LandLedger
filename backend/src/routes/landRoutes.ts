import { Router } from 'express';
import {
  getLands,
  getLand,
  createLand,
  updateLand,
  deleteLand,
  searchLands,
  verifyLand,
  getLandHistory,
  uploadLandDocument
} from '../controllers/landController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/search', searchLands);
router.get('/:id/history', getLandHistory);

// Protected routes
router.use(protect);

router.route('/')
  .get(getLands)
  .post(authorize('official', 'admin'), createLand);

router.route('/:id')
  .get(getLand)
  .put(authorize('official', 'admin'), updateLand)
  .delete(authorize('admin'), deleteLand);

router.put('/:id/verify', authorize('official', 'admin'), verifyLand);
router.post('/:id/documents', upload.single('document'), uploadLandDocument);

export default router;
