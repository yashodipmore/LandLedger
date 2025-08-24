import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'owner' | 'official' | 'admin';
  phone?: string;
  address?: string;
  walletAddress?: string;
  isVerified: boolean;
  emailVerificationToken?: string | undefined;
  resetPasswordToken?: string | undefined;
  resetPasswordExpire?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['citizen', 'owner', 'official', 'admin'],
    default: 'citizen'
  },
  phone: {
    type: String,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please add a valid phone number']
  },
  address: {
    type: String,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Please add a valid Ethereum wallet address']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const payload = { 
    id: this._id.toString(), 
    role: this.role 
  };
  
  const jwtSecret = secret as string;
  // Convert to seconds for JWT
  const expirationTime = 30 * 24 * 60 * 60; // 30 days in seconds
  
  return jwt.sign(payload, jwtSecret, { expiresIn: expirationTime });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function(): string {
  // Generate token
  const resetToken = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = bcrypt.hashSync(resetToken, 10);

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

export const User = mongoose.model<IUser>('User', userSchema);
