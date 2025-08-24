import { Router } from 'express';
import {
  getTransfers,
  getTransfer,
  initiateTransfer,
  approveTransfer,
  rejectTransfer,
  cancelTransfer,
  getMyTransfers
} from '../controllers/transferController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getTransfers)
  .post(initiateTransfer);

router.get('/my-transfers', getMyTransfers);

router.route('/:id')
  .get(getTransfer);

router.put('/:id/approve', authorize('official', 'admin'), approveTransfer);
router.put('/:id/reject', authorize('official', 'admin'), rejectTransfer);
router.put('/:id/cancel', cancelTransfer);

export default router;
