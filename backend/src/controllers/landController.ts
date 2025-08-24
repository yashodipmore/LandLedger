import { Request, Response, NextFunction } from 'express';
import { Land } from '../models/Land';
import { IUser } from '../models/User';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get all lands
// @route   GET /api/lands
// @access  Private
export const getLands = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const lands = await Land.find()
      .populate('owner', 'name email')
      .populate('verifiedBy', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Land.countDocuments();

    res.status(200).json({
      success: true,
      count: lands.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: lands
    });
  } catch (error) {
    logger.error('Get lands error:', error);
    next(error);
  }
};

// @desc    Get single land
// @route   GET /api/lands/:id
// @access  Private
export const getLand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const land = await Land.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('previousOwners.owner', 'name email')
      .populate('verifiedBy', 'name')
      .populate('documents.uploadedBy', 'name');

    if (!land) {
      res.status(404).json({
        success: false,
        message: 'Land not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: land
    });
  } catch (error) {
    logger.error('Get land error:', error);
    next(error);
  }
};

// @desc    Create new land record
// @route   POST /api/lands
// @access  Private (Officials and Admins only)
export const createLand = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Add user to req.body
    req.body.verifiedBy = req.user?.id;

    const land = await Land.create(req.body);

    res.status(201).json({
      success: true,
      data: land
    });
  } catch (error) {
    logger.error('Create land error:', error);
    next(error);
  }
};

// @desc    Update land record
// @route   PUT /api/lands/:id
// @access  Private (Officials and Admins only)
export const updateLand = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const land = await Land.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!land) {
      res.status(404).json({
        success: false,
        message: 'Land not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: land
    });
  } catch (error) {
    logger.error('Update land error:', error);
    next(error);
  }
};

// @desc    Delete land record
// @route   DELETE /api/lands/:id
// @access  Private (Admin only)
export const deleteLand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      res.status(404).json({
        success: false,
        message: 'Land not found'
      });
      return;
    }

    await land.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Land record deleted successfully'
    });
  } catch (error) {
    logger.error('Delete land error:', error);
    next(error);
  }
};

// @desc    Search lands
// @route   GET /api/lands/search
// @access  Public
export const searchLands = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, city, state, landType, minArea, maxArea } = req.query;

    let query: any = {};

    // Text search
    if (q) {
      query.$or = [
        { surveyNumber: { $regex: q, $options: 'i' } },
        { plotNumber: { $regex: q, $options: 'i' } },
        { 'location.address': { $regex: q, $options: 'i' } }
      ];
    }

    // Location filters
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (state) {
      query['location.state'] = { $regex: state, $options: 'i' };
    }

    // Land type filter
    if (landType) {
      query.landType = landType;
    }

    // Area filters
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = parseFloat(minArea as string);
      if (maxArea) query.area.$lte = parseFloat(maxArea as string);
    }

    // Only show verified lands in search
    query.verificationStatus = 'verified';
    query.status = 'active';

    const lands = await Land.find(query)
      .populate('owner', 'name')
      .select('-documents -previousOwners')
      .limit(50)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: lands.length,
      data: lands
    });
  } catch (error) {
    logger.error('Search lands error:', error);
    next(error);
  }
};

// @desc    Verify land record
// @route   PUT /api/lands/:id/verify
// @access  Private (Officials and Admins only)
export const verifyLand = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { verificationStatus } = req.body;

    const land = await Land.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus,
        verifiedBy: req.user?.id,
        verifiedAt: new Date(),
        isVerified: verificationStatus === 'verified'
      },
      { new: true, runValidators: true }
    );

    if (!land) {
      res.status(404).json({
        success: false,
        message: 'Land not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Land ${verificationStatus} successfully`,
      data: land
    });
  } catch (error) {
    logger.error('Verify land error:', error);
    next(error);
  }
};

// @desc    Get land ownership history
// @route   GET /api/lands/:id/history
// @access  Public
export const getLandHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const land = await Land.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('previousOwners.owner', 'name email')
      .select('surveyNumber plotNumber owner previousOwners');

    if (!land) {
      res.status(404).json({
        success: false,
        message: 'Land not found'
      });
      return;
    }

    // Combine current and previous owners for history
    const history = [
      ...land.previousOwners.map(prev => ({
        owner: prev.owner,
        fromDate: prev.fromDate,
        toDate: prev.toDate,
        isCurrent: false
      })),
      {
        owner: land.owner,
        fromDate: land.previousOwners.length > 0 
          ? land.previousOwners[land.previousOwners.length - 1].toDate 
          : land.registrationDate,
        toDate: null,
        isCurrent: true
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        land: {
          id: land._id,
          surveyNumber: land.surveyNumber,
          plotNumber: land.plotNumber
        },
        history: history.sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
      }
    });
  } catch (error) {
    logger.error('Get land history error:', error);
    next(error);
  }
};

// @desc    Upload land document
// @route   POST /api/lands/:id/documents
// @access  Private
export const uploadLandDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      res.status(404).json({
        success: false,
        message: 'Land not found'
      });
      return;
    }

    // Check if user is owner or official
    if (land.owner.toString() !== req.user?.id && !['official', 'admin'].includes(req.user?.role || '')) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to upload documents for this land'
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
      return;
    }

    // In a real implementation, you would:
    // 1. Generate document hash
    // 2. Upload to IPFS
    // 3. Store IPFS hash
    
    // For now, we'll just simulate this
    const documentHash = require('crypto').createHash('sha256').update(req.file.buffer || req.file.filename).digest('hex');
    const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}`; // Simulated IPFS hash

    const document = {
      type: req.body.type || 'other',
      documentHash,
      ipfsHash,
      uploadedBy: req.user?.id,
      uploadedAt: new Date()
    };

    land.documents.push(document as any);
    await land.save();

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });
  } catch (error) {
    logger.error('Upload document error:', error);
    next(error);
  }
};
