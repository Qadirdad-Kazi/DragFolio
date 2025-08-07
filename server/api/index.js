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

// Simple CORS configuration that will work in all environments
app.use((req, res, next) => {
  // Always allow the Netlify domain and localhost for development
  const netlifyDomain = 'https://dragfolio.netlify.app';
  
  // Get the origin from the request headers
  const origin = req.headers.origin;
  
  // Set CORS headers - allow Netlify domain or development origins
  if (origin === netlifyDomain || origin?.includes('localhost')) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // For all other origins, use a wildcard in development or block in production
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  // Common headers for all environments
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client-Performance-Metrics');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.header('Access-Control-Allow-Credentials', 'false');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

// Log CORS configuration
console.log('CORS configured with simplified settings for Netlify domain');


// Database connection with retry logic
const connectToDatabase = async (retryCount = 0, maxRetries = 5) => {
  const DATABASE_URL = process.env.DATABASE_URL || '';
  if (!DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    return;
  }
  
  try {
    console.log(`Attempting to connect to MongoDB (attempt ${retryCount + 1}/${maxRetries + 1})`);
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      w: 'majority'
    });
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff with max 10s
      console.log(`Retrying connection in ${delay}ms...`);
      setTimeout(() => connectToDatabase(retryCount + 1, maxRetries), delay);
    } else {
      console.error('Maximum MongoDB connection retries reached. Giving up.');
    }
  }
};

// Attempt to connect to the database
connectToDatabase();

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
  let dbStatus = 'disconnected';
  if (mongoose.connection.readyState === 1) dbStatus = 'connected';
  else if (mongoose.connection.readyState === 2) dbStatus = 'connecting';
  else if (mongoose.connection.readyState === 3) dbStatus = 'disconnecting';
  res.status(200).json({
    message: 'DragFolio API is running',
    dbStatus
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the Express API
export default app;
