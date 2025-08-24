import { Request, Response, NextFunction } from 'express';
import { Transfer } from '../models/Transfer';
import { Land } from '../models/Land';
import { IUser } from '../models/User';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get all transfers
// @route   GET /api/transfers
// @access  Private
export const getTransfers = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const transfers = await Transfer.find()
      .populate('land', 'surveyNumber plotNumber location.address')
      .populate('fromOwner', 'name email')
      .populate('toOwner', 'name email')
      .populate('initiatedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers
    });
  } catch (error) {
    logger.error('Get transfers error:', error);
    next(error);
  }
};

// @desc    Get single transfer
// @route   GET /api/transfers/:id
// @access  Private
export const getTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate('land')
      .populate('fromOwner', 'name email phone')
      .populate('toOwner', 'name email phone')
      .populate('initiatedBy', 'name')
      .populate('approvals.approvedBy', 'name');

    if (!transfer) {
      res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: transfer
    });
  } catch (error) {
    logger.error('Get transfer error:', error);
    next(error);
  }
};

// @desc    Initiate land transfer
// @route   POST /api/transfers
// @access  Private
export const initiateTransfer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { landId, toOwnerId, transferType, salePrice, transferDate } = req.body;

    // Check if land exists and user is the owner
    const land = await Land.findById(landId);
    if (!land) {
      res.status(404).json({
        success: false,
        message: 'Land not found'
      });
      return;
    }

    if (land.owner.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to transfer this land'
      });
      return;
    }

    if (land.status !== 'active') {
      res.status(400).json({
        success: false,
        message: 'Land is not available for transfer'
      });
      return;
    }

    // Create transfer record
    const transfer = await Transfer.create({
      land: landId,
      fromOwner: req.user.id,
      toOwner: toOwnerId,
      transferType,
      salePrice,
      transferDate,
      initiatedBy: req.user.id,
      status: 'pending_approval'
    });

    // Update land status
    land.status = 'under_transfer';
    await land.save();

    const populatedTransfer = await Transfer.findById(transfer._id)
      .populate('land', 'surveyNumber plotNumber')
      .populate('fromOwner', 'name email')
      .populate('toOwner', 'name email');

    res.status(201).json({
      success: true,
      message: 'Transfer initiated successfully',
      data: populatedTransfer
    });
  } catch (error) {
    logger.error('Initiate transfer error:', error);
    next(error);
  }
};

// @desc    Approve transfer
// @route   PUT /api/transfers/:id/approve
// @access  Private (Officials and Admins only)
export const approveTransfer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { comments } = req.body;

    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
      return;
    }

    if (transfer.status !== 'pending_approval') {
      res.status(400).json({
        success: false,
        message: 'Transfer is not pending approval'
      });
      return;
    }

    // Add approval
    transfer.approvals.push({
      approvedBy: req.user?.id!,
      approvedAt: new Date(),
      comments
    });

    transfer.status = 'approved';
    await transfer.save();

    res.status(200).json({
      success: true,
      message: 'Transfer approved successfully',
      data: transfer
    });
  } catch (error) {
    logger.error('Approve transfer error:', error);
    next(error);
  }
};

// @desc    Reject transfer
// @route   PUT /api/transfers/:id/reject
// @access  Private (Officials and Admins only)
export const rejectTransfer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rejectionReason } = req.body;

    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
      return;
    }

    if (transfer.status !== 'pending_approval') {
      res.status(400).json({
        success: false,
        message: 'Transfer is not pending approval'
      });
      return;
    }

    transfer.status = 'rejected';
    transfer.rejectionReason = rejectionReason;
    await transfer.save();

    // Update land status back to active
    const land = await Land.findById(transfer.land);
    if (land) {
      land.status = 'active';
      await land.save();
    }

    res.status(200).json({
      success: true,
      message: 'Transfer rejected successfully',
      data: transfer
    });
  } catch (error) {
    logger.error('Reject transfer error:', error);
    next(error);
  }
};

// @desc    Cancel transfer
// @route   PUT /api/transfers/:id/cancel
// @access  Private
export const cancelTransfer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
      return;
    }

    // Only the initiator can cancel
    if (transfer.initiatedBy.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this transfer'
      });
      return;
    }

    if (!['initiated', 'pending_approval'].includes(transfer.status)) {
      res.status(400).json({
        success: false,
        message: 'Transfer cannot be cancelled at this stage'
      });
      return;
    }

    transfer.status = 'cancelled';
    await transfer.save();

    // Update land status back to active
    const land = await Land.findById(transfer.land);
    if (land) {
      land.status = 'active';
      await land.save();
    }

    res.status(200).json({
      success: true,
      message: 'Transfer cancelled successfully',
      data: transfer
    });
  } catch (error) {
    logger.error('Cancel transfer error:', error);
    next(error);
  }
};

// @desc    Get user's transfers
// @route   GET /api/transfers/my-transfers
// @access  Private
export const getMyTransfers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const transfers = await Transfer.find({
      $or: [
        { fromOwner: req.user?.id },
        { toOwner: req.user?.id }
      ]
    })
    .populate('land', 'surveyNumber plotNumber location.address')
    .populate('fromOwner', 'name email')
    .populate('toOwner', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers
    });
  } catch (error) {
    logger.error('Get my transfers error:', error);
    next(error);
  }
};
