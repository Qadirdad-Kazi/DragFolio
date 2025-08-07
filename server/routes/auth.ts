import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User, IUser } from '../models/mongoose-schema';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, sendPasswordResetEmail } from '../utils/email';

const router = express.Router();

// User schema validation
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});

// Login schema validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Password reset request schema
const passwordResetRequestSchema = z.object({
  email: z.string().email()
});

// Password reset schema
const passwordResetSchema = z.object({
  token: z.string(),
  password: z.string().min(6)
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'dragfolio-jwt-secret';

// Password reset token expiration time (1 hour)
const PASSWORD_RESET_TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

// Add password reset token field to User model
User.schema.add({
  passwordResetToken: String,
  passwordResetExpires: Date
});

// Helper function to generate password reset token
const generatePasswordResetToken = async (userId: string) => {
  const resetToken = uuidv4();
  const hashedToken = await bcrypt.hash(resetToken, 10);
  
  await User.findByIdAndUpdate(userId, {
    passwordResetToken: hashedToken,
    passwordResetExpires: new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY)
  });
  
  return resetToken;
};

// Helper function to verify password reset token
const verifyPasswordResetToken = async (token: string) => {
  const user = await User.findOne({
    passwordResetToken: await bcrypt.hash(token, 10),
    passwordResetExpires: { $gt: new Date() }
  });
  
  if (!user) {
    throw new Error('Invalid or expired password reset token');
  }
  
  return user;
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validatedData = userSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      // Optionally, trigger a resend of registration/verification email
      try {
        await sendEmail({
          to: existingUser.email,
          subject: 'Account Already Exists',
          text: `An account with this email already exists. If you did not receive a verification email, please check your spam folder or contact support.`
        });
      } catch (emailError) {
        console.error('Resend registration email error:', emailError);
      }
      return res.status(400).json({ message: 'User already exists. Verification email resent if applicable.' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    
    // Create new user
    const newUser = new User({
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name || validatedData.email.split('@')[0]
    });
    
    // Save user to MongoDB
    await newUser.save();
    
    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    
    // Find user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data and token
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request password reset endpoint
router.post('/password-reset', async (req, res) => {
  try {
    const validatedData = passwordResetRequestSchema.parse(req.body);
    const user = await User.findOne<IUser>({ email: validatedData.email });
    
    if (!user) {
      return res.json({ message: 'If an account exists with this email, you will receive a password reset link' });
    }
    
    const resetToken = await generatePasswordResetToken(user._id as string);
    await sendPasswordResetEmail(validatedData.email, resetToken);
    
    res.json({ message: 'If an account exists with this email, you will receive a password reset link' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const validatedData = passwordResetSchema.parse(req.body);
    const user = await verifyPasswordResetToken(validatedData.token);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      passwordResetToken: undefined,
      passwordResetExpires: undefined
    });
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    if (error.message === 'Invalid or expired password reset token') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth endpoint (placeholder)
router.get('/google', (req, res) => {
  res.status(501).json({ message: 'Google OAuth not implemented yet' });
});

// Get current user endpoint
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // Cast to IUser type
  const user = req.user as IUser;
  res.json({
    id: user._id,
    email: user.email,
    name: user.name
  });
});

// Request password reset
router.post('/password-reset', async (req, res) => {
  try {
    const validatedData = passwordResetRequestSchema.parse(req.body);
    const user = await User.findOne({ email: validatedData.email });
  } catch (error) {
    console.error('Password reset error:', error);
    if (error.message === 'Invalid or expired password reset token') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
