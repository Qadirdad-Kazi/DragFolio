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
const PORT = parseInt(process.env.PORT || '3001'); // Default to 3001 if not specified
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
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment variable or use defaults
    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
    
    // Default development origins
    const devOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177'
    ];
    
    // Parse comma-separated origins from environment variable
    const prodOrigins = allowedOriginsEnv.split(',').map(origin => origin.trim()).filter(Boolean);
    
    // Use production origins if in production, otherwise use development origins
    const allowedOrigins = process.env.NODE_ENV === 'production' ? prodOrigins : devOrigins;
    
    // In development mode, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against the allowed origins list
    if (allowedOrigins.indexOf(origin) !== -1) {
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

// Log CORS configuration
console.log('CORS configured for:', process.env.NODE_ENV === 'production' ? 'production' : 'development');

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

// Database setup
const db = mongoose.connection;

if (DATABASE_URL) {
  mongoose.connect(DATABASE_URL)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('No DATABASE_URL provided, database features will not work');
}

// Export database for routes
export { db };

// API routes

// Root endpoint for API and DB status
app.get('/', (req, res) => {
  let dbStatus = 'disconnected';
  if (db.readyState === 1) dbStatus = 'connected';
  else if (db.readyState === 2) dbStatus = 'connecting';
  else if (db.readyState === 3) dbStatus = 'disconnecting';
  res.json({
    message: 'DragFolio API is running',
    dbStatus
  });
});

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
