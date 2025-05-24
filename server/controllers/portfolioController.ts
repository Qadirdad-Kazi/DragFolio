import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Mock portfolio database (replace with actual DB implementation)
interface Portfolio {
  id: string;
  title: string;
  description?: string;
  sections: Array<{
    id: string;
    type: 'about' | 'projects' | 'skills' | 'resume' | 'testimonials' | 'blog' | 'contact';
    title: string;
    content: any;
    order: number;
    layout: 'full' | 'half' | 'two-columns';
    settings?: Record<string, any>;
  }>;
  theme: {
    mode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
  };
  isPublished: boolean;
  subdomain?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const portfolios: Portfolio[] = [];

// Get all portfolios for a user
export const getUserPortfolios = async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would be filtered by the authenticated user
    // For now, just return all portfolios
    const userId = req.params.userId || '1'; // Mock user ID
    const userPortfolios = portfolios.filter(p => p.userId === userId);
    
    res.json(userPortfolios);
  } catch (error) {
    console.error('Get user portfolios error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific portfolio
export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = portfolios.find(p => p.id === req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new portfolio
export const createPortfolio = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = portfolioSchema.parse(req.body);
    
    // Get user ID from authenticated session (mock for now)
    const userId = '1'; // Mock user ID
    
    // Create new portfolio
    const newPortfolio = {
      id: Date.now().toString(),
      ...validatedData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save portfolio (mock implementation)
    portfolios.push(newPortfolio);
    
    res.status(201).json(newPortfolio);
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a portfolio
export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    // Find portfolio
    const portfolioIndex = portfolios.findIndex(p => p.id === req.params.id);
    if (portfolioIndex === -1) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio (mock implementation)
    const userId = '1'; // Mock user ID
    if (portfolios[portfolioIndex].userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Validate request body
    const validatedData = portfolioSchema.parse(req.body);
    
    // Update portfolio
    const updatedPortfolio = {
      ...portfolios[portfolioIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated portfolio (mock implementation)
    portfolios[portfolioIndex] = updatedPortfolio;
    
    res.json(updatedPortfolio);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a portfolio
export const deletePortfolio = async (req: Request, res: Response) => {
  try {
    // Find portfolio
    const portfolioIndex = portfolios.findIndex(p => p.id === req.params.id);
    if (portfolioIndex === -1) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio (mock implementation)
    const userId = '1'; // Mock user ID
    if (portfolios[portfolioIndex].userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Remove portfolio (mock implementation)
    portfolios.splice(portfolioIndex, 1);
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export portfolio as HTML/ZIP
export const exportPortfolio = async (req: Request, res: Response) => {
  try {
    // Find portfolio
    const portfolio = portfolios.find(p => p.id === req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio (mock implementation)
    const userId = '1'; // Mock user ID
    if (portfolio.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // In a real implementation, this would generate HTML files based on the portfolio data
    // For now, just return a mock response
    
    // This is a placeholder for the actual HTML generation logic
    // In a real implementation, you would:
    // 1. Generate HTML, CSS, and JS files based on the portfolio data
    // 2. Create a ZIP file containing these files
    // 3. Send the ZIP file as a response
    
    res.json({
      message: 'Export functionality would generate a ZIP file with HTML, CSS, and JS files',
      portfolio: portfolio.title
    });
  } catch (error) {
    console.error('Export portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Deploy portfolio to subdomain
export const deployPortfolio = async (req: Request, res: Response) => {
  try {
    // Find portfolio
    const portfolio = portfolios.find(p => p.id === req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio (mock implementation)
    const userId = '1'; // Mock user ID
    if (portfolio.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Validate subdomain
    const { subdomain } = req.body;
    if (!subdomain) {
      return res.status(400).json({ message: 'Subdomain is required' });
    }
    
    // Check if subdomain is available (mock implementation)
    const isSubdomainTaken = portfolios.some(p => 
      p.id !== portfolio.id && p.subdomain === subdomain
    );
    
    if (isSubdomainTaken) {
      return res.status(400).json({ message: 'Subdomain is already taken' });
    }
    
    // Update portfolio with subdomain
    const portfolioIndex = portfolios.findIndex(p => p.id === req.params.id);
    portfolios[portfolioIndex] = {
      ...portfolio,
      subdomain,
      isPublished: true,
      updatedAt: new Date().toISOString()
    };
    
    // In a real implementation, this would deploy the portfolio to the subdomain
    // For now, just return a mock response
    
    res.json({
      message: 'Portfolio deployed successfully',
      url: `https://${subdomain}.portfoliohub.app`
    });
  } catch (error) {
    console.error('Deploy portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
