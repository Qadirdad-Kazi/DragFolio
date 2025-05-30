import express from 'express';
import { z } from 'zod';
import { getTemplates } from './template';
import { Portfolio } from '../models/mongoose-schema';

const router = express.Router();

// Portfolio schema validation
const portfolioSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['about', 'projects', 'skills', 'resume', 'testimonials', 'blog', 'contact']),
      title: z.string(),
      content: z.any().optional(), // Make content optional to match template data
      order: z.number(),
      layout: z.enum(['full', 'half', 'two-columns']).default('full'),
      settings: z.record(z.any()).optional()
    })
  ).optional(), // Make sections optional during creation
  theme: z.object({
    mode: z.enum(['light', 'dark']).default('light'),
    primaryColor: z.string().default('#3490dc'),
    secondaryColor: z.string().default('#ffed4a'),
    fontFamily: z.string().default('Inter, sans-serif'),
    fontSize: z.string().default('16px')
  }).optional(), // Make theme optional during creation
  isPublished: z.boolean().default(false),
  userId: z.string()
}).passthrough(); // Allow extra fields like 'template'

// Get all portfolios for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const portfolios = await Portfolio.find({ userId });
    res.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ message: 'Error fetching portfolios' });
  }
});

// Get a specific portfolio
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
});

// Create a portfolio
router.post('/', async (req, res) => {
  try {
    // Check if a template ID is provided
    if (req.body.templateId) {
      const templates = getTemplates();
      const template = templates.find(t => t.id === req.body.templateId);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
      
      // Create portfolio based on template
      const newPortfolio = new Portfolio({
        ...template,
        title: req.body.title,
        description: req.body.description,
        userId: req.body.userId,
        isPublished: false
      });
      await newPortfolio.save();
      return res.status(201).json(newPortfolio);
    }
    
    // Create portfolio from request body
    const portfolio = new Portfolio(req.body);
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(400).json({ message: 'Invalid portfolio data' });
  }
});

// Update a portfolio
router.put('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(400).json({ message: 'Invalid portfolio data' });
  }
});

// Delete a portfolio
router.delete('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ message: 'Error deleting portfolio' });
  }
});

// Deployment functionality removed

export default router;
