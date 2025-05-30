// This file is specifically for Vercel deployment
// It serves as an entry point for the Vercel serverless function

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createMiddleware } from '../middleware/registrationControl.js';

// Load environment variables
dotenv.config();

// Import routes - adjust these imports based on your actual file structure
import authRoutes from '../routes/auth.js';
import portfolioRoutes from '../routes/portfolio.js';
import templateRoutes from '../routes/template.js';
import userRoutes from '../routes/user.js';

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
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/users', userRoutes);

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
