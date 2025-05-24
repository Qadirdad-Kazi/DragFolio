import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

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

// Mock user database (replace with actual DB implementation)
const users = [];

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'dragfolio-jwt-secret';

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validatedData = userSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === validatedData.email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name || validatedData.email.split('@')[0]
    };
    
    // Save user (mock implementation)
    users.push(newUser);
    
    // Generate JWT
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
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
    const user = users.find(user => user.email === validatedData.email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data and token
    res.json({
      token,
      user: {
        id: user.id,
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

// Google OAuth endpoint (placeholder)
router.get('/google', (req, res) => {
  res.status(501).json({ message: 'Google OAuth not implemented yet' });
});

// Get current user endpoint
router.get('/me', (req, res) => {
  // This would use middleware to verify the JWT token
  // For now, just return a placeholder response
  res.status(501).json({ message: 'Get current user not implemented yet' });
});

export default router;
