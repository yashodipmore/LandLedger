import mongoose, { Document, Schema } from 'mongoose';

export interface ILand extends Document {
  _id: string;
  surveyNumber: string;
  plotNumber: string;
  area: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  owner: mongoose.Types.ObjectId;
  previousOwners: Array<{
    owner: mongoose.Types.ObjectId;
    fromDate: Date;
    toDate: Date;
  }>;
  landType: 'agricultural' | 'residential' | 'commercial' | 'industrial';
  marketValue: number;
  registrationDate: Date;
  documents: Array<{
    type: 'sale_deed' | 'title_deed' | 'survey_document' | 'tax_receipt' | 'other';
    documentHash: string;
    ipfsHash: string;
    uploadedAt: Date;
    uploadedBy: mongoose.Types.ObjectId;
  }>;
  blockchainTxHash?: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  status: 'active' | 'under_transfer' | 'disputed' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const landSchema = new Schema<ILand>({
  surveyNumber: {
    type: String,
    required: [true, 'Survey number is required'],
    unique: true,
    trim: true
  },
  plotNumber: {
    type: String,
    required: [true, 'Plot number is required'],
    trim: true
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: [0.01, 'Area must be greater than 0']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      maxlength: [50, 'State cannot exceed 50 characters']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  previousOwners: [{
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    }
  }],
  landType: {
    type: String,
    enum: ['agricultural', 'residential', 'commercial', 'industrial'],
    required: [true, 'Land type is required']
  },
  marketValue: {
    type: Number,
    required: [true, 'Market value is required'],
    min: [0, 'Market value must be greater than 0']
  },
  registrationDate: {
    type: Date,
    required: [true, 'Registration date is required']
  },
  documents: [{
    type: {
      type: String,
      enum: ['sale_deed', 'title_deed', 'survey_document', 'tax_receipt', 'other'],
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
  blockchainTxHash: {
    type: String,
    sparse: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  status: {
    type: String,
    enum: ['active', 'under_transfer', 'disputed', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for efficient queries
landSchema.index({ surveyNumber: 1 });
landSchema.index({ owner: 1 });
landSchema.index({ 'location.city': 1, 'location.state': 1 });
landSchema.index({ verificationStatus: 1 });
landSchema.index({ status: 1 });

export const Land = mongoose.model<ILand>('Land', landSchema);
