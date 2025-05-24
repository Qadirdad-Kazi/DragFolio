import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
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

// Initialize Express app
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://dragfolio.app' 
    : 'http://localhost:5173',
  credentials: true
}));

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
let db;
if (DATABASE_URL) {
  const sql = neon(DATABASE_URL);
  db = drizzle(sql);
  console.log('Connected to database');
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
