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
  console.log('Templates endpoint accessed');
  // Return a more complete response with sample data
  res.status(200).json({
    success: true,
    message: 'Templates endpoint is active',
    templates: [
      { id: 1, name: 'Portfolio Template 1', description: 'A modern portfolio layout' },
      { id: 2, name: 'Resume Template', description: 'Professional resume layout' },
      { id: 3, name: 'Project Showcase', description: 'Template for showcasing projects' }
    ]
  });
});

// User routes
userRouter.get('/profile', (req, res) => {
  res.status(200).json({ message: 'User profile endpoint is active' });
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Registration control middleware
app.use(createMiddleware());

// Add CORS headers directly for maximum compatibility
app.use((req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client-Performance-Metrics');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

// Log CORS configuration
console.log('CORS configured with manual headers for maximum compatibility');

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
