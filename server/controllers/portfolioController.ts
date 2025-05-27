import { Request, Response } from 'express';
import { Portfolio, IPortfolio } from '../models/mongoose-schema';
import { isSubdomainAvailable } from '../utils/subdomain';

// Define portfolio validation types
type PortfolioSection = {
  id: string;
  type: 'about' | 'projects' | 'skills' | 'resume' | 'testimonials' | 'blog' | 'contact';
  title: string;
  content: any;
  order: number;
  layout: 'full' | 'half' | 'two-columns';
  settings?: Record<string, any>;
};

type PortfolioTheme = {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
};

type PortfolioData = {
  title: string;
  description?: string;
  sections: PortfolioSection[];
  theme: PortfolioTheme;
  isPublished: boolean;
  subdomain?: string;
};

// Get all portfolios for a user
export const getUserPortfolios = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    // Get portfolios from database
    const portfolios = await Portfolio.find({ userId });
    res.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ message: 'Error fetching portfolios' });
  }
};

// Get a specific portfolio
export const getPortfolio = async (req: Request, res: Response) => {
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
};

// Create a new portfolio
export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const { title, description, sections, theme, userId } = req.body;
    
    // Validate request body
    if (!title || !userId) {
      return res.status(400).json({ message: 'Title and userId are required' });
    }
    
    // Create new portfolio
    const portfolio = new Portfolio(req.body);
    await portfolio.save();
    
    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ message: 'Error creating portfolio' });
  }
};

// Update a portfolio
export const updatePortfolio = async (req: Request, res: Response) => {
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
    res.status(500).json({ message: 'Error updating portfolio' });
  }
};

// Delete a portfolio
export const deletePortfolio = async (req: Request, res: Response) => {
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
};

// Export portfolio as HTML/ZIP
export const exportPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.status(501).json({ message: 'Export functionality not implemented yet' });
  } catch (error) {
    console.error('Error exporting portfolio:', error);
    res.status(500).json({ message: 'Error exporting portfolio' });
  }
};

// Deploy portfolio to subdomain
export const deployPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Check if user owns the portfolio
    const userId = req.body.userId;
    if (!userId || portfolio.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Validate subdomain
    const { subdomain } = req.body;
    if (!subdomain) {
      return res.status(400).json({ message: 'Subdomain is required' });
    }

    const isAvailable = await isSubdomainAvailable(subdomain);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Subdomain is already taken' });
    }

    portfolio.subdomain = subdomain;
    portfolio.isPublished = true;
    portfolio.updatedAt = new Date();
    await portfolio.save();

    res.json({
      message: 'Portfolio deployed successfully',
      url: `https://${subdomain}.portfoliohub.app`
    });
  } catch (error) {
    console.error('Deploy portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
