import express from 'express';
import { Request, Response } from 'express';
import { web3Service } from '../blockchain/web3Service';
import { landRegistryService } from '../blockchain/landRegistryService';
import { protect } from '../middleware/auth';

const router = express.Router();

// Network Information
router.get('/network', async (_req: Request, res: Response) => {
  try {
    const networkInfo = await web3Service.getNetworkInfo();
    const accountInfo = await web3Service.getAccountInfo();
    
    res.json({
      success: true,
      data: {
        network: networkInfo,
        account: accountInfo
      }
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get network information',
      error: error.message
    });
    return;
  }
});

// Contract Statistics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await landRegistryService.getContractStats();
    
    res.json({
      success: true,
      data: stats
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get contract statistics',
      error: error.message
    });
    return;
  }
});

// Register Land (Protected Route - Officials only)
router.post('/land/register', protect, async (req: Request, res: Response) => {
  try {
    const {
      landId,
      owner,
      latitude,
      longitude,
      area,
      documentHash,
      physicalAddress,
      landType
    } = req.body;

    const result = await landRegistryService.registerLand({
      landId,
      owner,
      latitude: parseInt(latitude),
      longitude: parseInt(longitude),
      area: parseInt(area),
      documentHash,
      physicalAddress,
      landType
    });

    res.status(201).json({
      success: true,
      message: 'Land registered successfully on blockchain',
      data: result
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to register land on blockchain',
      error: error.message
    });
    return;
  }
});

// Get Land Details
router.get('/land/:landId', async (req: Request, res: Response) => {
  try {
    const { landId } = req.params;
    
    const landDetails = await landRegistryService.getLandDetails(landId);
    
    res.json({
      success: true,
      data: landDetails
    });
    return;
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: 'Land not found on blockchain',
      error: error.message
    });
    return;
  }
});

// Request Transfer (Protected Route)
router.post('/transfer/request', protect, async (req: Request, res: Response) => {
  try {
    const { landId, newOwner, amount } = req.body;

    const result = await landRegistryService.requestTransfer({
      landId,
      newOwner,
      amount: amount || "0"
    });

    res.json({
      success: true,
      message: 'Transfer request submitted to blockchain',
      data: result
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to request transfer on blockchain',
      error: error.message
    });
    return;
  }
});

// Approve Transfer (Officials only)
router.post('/transfer/approve', protect, async (req: Request, res: Response) => {
  try {
    const { landId } = req.body;

    const result = await landRegistryService.approveTransfer(landId);

    res.json({
      success: true,
      message: 'Transfer approved successfully on blockchain',
      data: result
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve transfer on blockchain',
      error: error.message
    });
    return;
  }
});

export default router;
