// This file is specifically for Vercel deployment
// It serves as an entry point for the Vercel serverless function

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createMiddleware } from '../middleware/registrationControl.js';

// Load environment variables
dotenv.config();

// Create route handlers directly since we can't import the TypeScript files directly
const authRouter = express.Router();
const portfolioRouter = express.Router();
const templateRouter = express.Router();
const userRouter = express.Router();

// Auth routes
authRouter.post('/register', (req, res) => {
  // Check if registration is allowed
  const allowRegistration = process.env.ALLOW_REGISTRATION?.toLowerCase() === 'yes';
  
  if (!allowRegistration) {
    return res.status(403).json({
      error: 'Registration is currently disabled by the administrator',
      message: 'New user registration is not allowed at this time'
    });
  }
  
  // If allowed, return success for now (this would connect to your database in production)
  res.status(200).json({ message: 'Registration endpoint is active' });
});

authRouter.post('/login', (req, res) => {
  // Simple mock login endpoint
  res.status(200).json({ message: 'Login endpoint is active' });
});

// Portfolio routes
portfolioRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'Portfolio list endpoint is active' });
});

portfolioRouter.get('/:id', (req, res) => {
  res.status(200).json({ message: `Portfolio ${req.params.id} endpoint is active` });
});

// Template routes
templateRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'Templates endpoint is active' });
});

// User routes
userRouter.get('/profile', (req, res) => {
  res.status(200).json({ message: 'User profile endpoint is active' });
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registration control middleware
app.use(createMiddleware());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment variable or use defaults
    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
    
    // Parse comma-separated origins from environment variable
    const prodOrigins = allowedOriginsEnv.split(',').map(origin => origin.trim()).filter(Boolean);
    
    // In development mode, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against the allowed origins list
    if (prodOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || '';
if (DATABASE_URL) {
  mongoose.connect(DATABASE_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
app.use('/api/auth', authRouter);
app.use('/api/portfolios', portfolioRouter);
app.use('/api/templates', templateRouter);
app.use('/api/users', userRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'DragFolio API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the Express API
export default app;
