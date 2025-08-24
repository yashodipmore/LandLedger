import mongoose, { Document, Schema } from 'mongoose';

export interface ITransfer extends Document {
  _id: string;
  land: mongoose.Types.ObjectId;
  fromOwner: mongoose.Types.ObjectId;
  toOwner: mongoose.Types.ObjectId;
  transferType: 'sale' | 'gift' | 'inheritance' | 'court_order';
  salePrice?: number;
  transferDate: Date;
  documents: Array<{
    type: 'sale_agreement' | 'noc' | 'stamp_duty' | 'registration_fee' | 'other';
    documentHash: string;
    ipfsHash: string;
    uploadedAt: Date;
    uploadedBy: mongoose.Types.ObjectId;
  }>;
  status: 'initiated' | 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  approvals: Array<{
    approvedBy: mongoose.Types.ObjectId;
    approvedAt: Date;
    comments?: string;
  }>;
  rejectionReason?: string;
  blockchainTxHash?: string;
  fees: {
    stampDuty: number;
    registrationFee: number;
    otherCharges: number;
    total: number;
  };
  initiatedBy: mongoose.Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transferSchema = new Schema<ITransfer>({
  land: {
    type: Schema.Types.ObjectId,
    ref: 'Land',
    required: [true, 'Land reference is required']
  },
  fromOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'From owner is required']
  },
  toOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'To owner is required']
  },
  transferType: {
    type: String,
    enum: ['sale', 'gift', 'inheritance', 'court_order'],
    required: [true, 'Transfer type is required']
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price must be greater than or equal to 0'],
    validate: {
      validator: function(this: ITransfer, value: number) {
        // Sale price is required for sale transfers
        if (this.transferType === 'sale') {
          return value != null && value > 0;
        }
        return true;
      },
      message: 'Sale price is required for sale transfers'
    }
  },
  transferDate: {
    type: Date,
    required: [true, 'Transfer date is required']
  },
  documents: [{
    type: {
      type: String,
      enum: ['sale_agreement', 'noc', 'stamp_duty', 'registration_fee', 'other'],
      required: true
    },
    documentHash: {
      type: String,
      required: true
    },
    ipfsHash: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['initiated', 'pending_approval', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'initiated'
  },
  approvals: [{
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    approvedAt: {
      type: Date,
      default: Date.now
    },
    comments: String
  }],
  rejectionReason: String,
  blockchainTxHash: String,
  fees: {
    stampDuty: {
      type: Number,
      default: 0,
      min: [0, 'Stamp duty must be greater than or equal to 0']
    },
    registrationFee: {
      type: Number,
      default: 0,
      min: [0, 'Registration fee must be greater than or equal to 0']
    },
    otherCharges: {
      type: Number,
      default: 0,
      min: [0, 'Other charges must be greater than or equal to 0']
    },
    total: {
      type: Number,
      default: 0,
      min: [0, 'Total fees must be greater than or equal to 0']
    }
  },
  initiatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Initiated by is required']
  },
  completedAt: Date
}, {
  timestamps: true
});

// Calculate total fees before saving
transferSchema.pre('save', function(next) {
  this.fees.total = this.fees.stampDuty + this.fees.registrationFee + this.fees.otherCharges;
  next();
});

// Index for efficient queries
transferSchema.index({ land: 1 });
transferSchema.index({ fromOwner: 1 });
transferSchema.index({ toOwner: 1 });
transferSchema.index({ status: 1 });
transferSchema.index({ transferDate: 1 });

export const Transfer = mongoose.model<ITransfer>('Transfer', transferSchema);
