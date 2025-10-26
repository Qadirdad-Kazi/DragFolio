// This file is specifically for Vercel deployment
// It serves as an entry point for the Vercel serverless function

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'dragfolio-jwt-secret';

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

// Define User Schema
const userMongooseSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create or retrieve User model (avoid OverwriteModelError)
const User = mongoose.models.User || mongoose.model('User', userMongooseSchema);

// Define Portfolio Schema
const portfolioMongooseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  sections: { type: Array, default: [] },
  theme: { type: Object, default: {} },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioMongooseSchema);

// Define Template Schema
const templateMongooseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  sections: { type: Array, default: [] },
  theme: { type: Object, default: {} },
  preview: String,
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Template = mongoose.models.Template || mongoose.model('Template', templateMongooseSchema);

// Create route handlers
const authRouter = express.Router();
const portfolioRouter = express.Router();
const templateRouter = express.Router();
const userRouter = express.Router();

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Auth routes - REGISTER
authRouter.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body.email);
    
    // Validate request body
    const validatedData = userSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      console.log('User already exists:', validatedData.email);
      return res.status(400).json({ message: 'User already exists' });
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
    console.log('User created successfully:', newUser.email);
    
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Auth routes - LOGIN
authRouter.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    
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
    
    console.log('Login successful:', user.email);
    
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

// Auth routes - GET current user
authRouter.get('/me', authMiddleware, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name
  });
});

// Portfolio routes
portfolioRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user._id });
    res.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

portfolioRouter.get('/:id', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio or if it's public
    if (portfolio.userId.toString() !== req.user._id.toString() && !portfolio.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

portfolioRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const newPortfolio = new Portfolio({
      ...req.body,
      userId: req.user._id
    });
    
    await newPortfolio.save();
    res.status(201).json(newPortfolio);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

portfolioRouter.put('/:id', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    res.json(updatedPortfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

portfolioRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Template routes
templateRouter.get('/', async (req, res) => {
  try {
    console.log('Templates endpoint accessed');
    const templates = await Template.find({ isPublic: true });
    res.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    // Return sample data on error
    res.json({
      templates: [
        { id: 1, name: 'Portfolio Template 1', description: 'A modern portfolio layout', isPublic: true },
        { id: 2, name: 'Resume Template', description: 'Professional resume layout', isPublic: true },
        { id: 3, name: 'Project Showcase', description: 'Template for showcasing projects', isPublic: true }
      ]
    });
  }
});

templateRouter.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes
userRouter.get('/profile', authMiddleware, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name
  });
});

userRouter.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    res.json({
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const app = express();

// Request logging middleware (early in the chain)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  next();
});

// CORS configuration - MUST come before other middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://dragfolio.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ];
  
  // Check if origin is in allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow requests with no origin (like Postman, curl)
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client-Performance-Metrics');
  res.header('Access-Control-Max-Age', '86400');
  res.header('Access-Control-Allow-Credentials', 'false');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log CORS configuration
console.log('CORS configured for production and development origins');

// Database connection with retry logic
let isConnecting = false;
let isConnected = false;

const connectToDatabase = async (retryCount = 0, maxRetries = 5) => {
  // Avoid multiple simultaneous connection attempts
  if (isConnecting || isConnected) {
    console.log('Database connection already in progress or established');
    return;
  }
  
  const DATABASE_URL = process.env.DATABASE_URL || '';
  if (!DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    return;
  }
  
  isConnecting = true;
  
  try {
    console.log(`Attempting to connect to MongoDB (attempt ${retryCount + 1}/${maxRetries + 1})`);
    
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      isConnected = true;
      isConnecting = false;
      return;
    }
    
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('Successfully connected to MongoDB');
    isConnected = true;
    isConnecting = false;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    isConnecting = false;
    
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      console.log(`Retrying connection in ${delay}ms...`);
      setTimeout(() => connectToDatabase(retryCount + 1, maxRetries), delay);
    } else {
      console.error('Maximum MongoDB connection retries reached.');
    }
  }
};

// Connect to database
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
