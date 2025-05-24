import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth';
import portfolioRoutes from './routes/portfolio';
import templateRoutes from './routes/template';
import userRoutes from './routes/user';

// Environment variables
const PORT = process.env.PORT || 3001;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dragfolio-secret-key';
const DATABASE_URL = process.env.DATABASE_URL || '';

// Debug logging
console.log('Environment variables loaded:');
console.log('DATABASE_URL exists:', !!DATABASE_URL);
console.log('DATABASE_URL starts with:', DATABASE_URL ? DATABASE_URL.substring(0, 15) + '...' : 'empty');

// Initialize Express app
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://dragfolio.app' 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true
}));

// Log CORS configuration
console.log('CORS configured for development:', ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176']);

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

// Database connection
if (DATABASE_URL) {
  mongoose.connect(DATABASE_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('No DATABASE_URL provided, database features will not work');
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/users', userRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
