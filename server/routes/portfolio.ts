import express from 'express';
import { z } from 'zod';
import { getTemplates } from './template';

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
  subdomain: z.string().optional(),
  userId: z.string()
}).passthrough(); // Allow extra fields like 'template'

// Mock portfolio database (replace with actual DB implementation)
const portfolios: any[] = [];

// Get all portfolios for a user
router.get('/', (req, res) => {
  // In a real implementation, this would be filtered by the authenticated user
  // For now, just return all portfolios
  res.json(portfolios);
});

// Get a specific portfolio
router.get('/:id', (req, res) => {
  const portfolio = portfolios.find((p: any) => p.id === req.params.id);
  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }
  res.json(portfolio);
});

// Create a new portfolio
router.post('/', async (req, res) => {
  try {
    console.log('Creating portfolio with data:', req.body);
    
    // Check if a template ID is provided
    const { template: templateId, ...portfolioData } = req.body as { template?: string } & Record<string, any>;
    
    let initialSections: any[] = [];
    let initialTheme = {
      mode: 'light' as const,
      primaryColor: '#3490dc',
      secondaryColor: '#ffed4a',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px'
    };
    
    // If a template ID is provided, fetch the template and use its sections and theme
    if (templateId) {
      console.log('Template ID provided:', templateId);
      
      // Find the template from the mock templates array in template.ts
      // In a real implementation, this would be a database query
      const templates = getTemplates();
      console.log('Available templates:', templates.map((t: any) => ({ id: t.id, name: t.name })));
      
      const template = templates.find((t: any) => t.id === templateId);
      
      if (template) {
        console.log('Template found:', template.name);
        console.log('Template sections:', JSON.stringify(template.sections, null, 2));
        console.log('Template theme:', JSON.stringify(template.theme, null, 2));
        
        // Deep clone to avoid reference issues
        initialSections = JSON.parse(JSON.stringify(template.sections)); 
        initialTheme = JSON.parse(JSON.stringify(template.theme));
        
        console.log('Initial sections after cloning:', JSON.stringify(initialSections, null, 2));
      } else {
        console.log('Template not found with ID:', templateId);
        return res.status(404).json({ message: 'Template not found' });
      }
    }
    
    // Ensure we have a userId
    if (!portfolioData.userId) {
      portfolioData.userId = 'demo-user'; // In a real app, this would come from authentication
    }
    
    // Merge the portfolio data with the template data
    const mergedData = {
      ...portfolioData,
      sections: portfolioData.sections || initialSections,
      theme: portfolioData.theme || initialTheme
    };
    
    console.log('Merged portfolio data:', JSON.stringify(mergedData, null, 2));
    
    // Validate the merged data with safeParse to get detailed error information
    const validationResult = portfolioSchema.safeParse(mergedData);
    
    if (!validationResult.success) {
      console.error('Portfolio validation failed:', JSON.stringify(validationResult.error.format(), null, 2));
      return res.status(400).json({
        message: 'Validation error',
        errors: validationResult.error.errors
      });
    }
    
    const validatedData = validationResult.data;
    
    // Create new portfolio
    const newPortfolio = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save portfolio (mock implementation)
    portfolios.push(newPortfolio);
    
    console.log('Successfully created portfolio:', JSON.stringify(newPortfolio, null, 2));
    res.status(201).json(newPortfolio);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a portfolio
router.put('/:id', (req, res) => {
  try {
    // Find portfolio
    const portfolioIndex = portfolios.findIndex((p: any) => p.id === req.params.id);
    if (portfolioIndex === -1) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Validate request body
    const validatedData = portfolioSchema.parse(req.body);
    
    // Update portfolio
    const updatedPortfolio = {
      ...portfolios[portfolioIndex] as any,
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated portfolio (mock implementation)
    portfolios[portfolioIndex] = updatedPortfolio;
    
    res.json(updatedPortfolio);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a portfolio
router.delete('/:id', (req, res) => {
  // Find portfolio
  const portfolioIndex = portfolios.findIndex(p => p.id === req.params.id);
  if (portfolioIndex === -1) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }
  
  // Remove portfolio (mock implementation)
  portfolios.splice(portfolioIndex, 1);
  
  res.status(204).send();
});

// Export portfolio as HTML/ZIP
router.get('/:id/export', (req, res) => {
  // This would generate and return a ZIP file with the portfolio HTML/CSS/JS
  res.status(501).json({ message: 'Export functionality not implemented yet' });
});

// Deploy portfolio to subdomain
router.post('/:id/deploy', (req, res) => {
  // This would deploy the portfolio to a subdomain
  res.status(501).json({ message: 'Deploy functionality not implemented yet' });
});

export default router;
