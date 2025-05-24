import express from 'express';
import { z } from 'zod';

const router = express.Router();

// User update schema validation
const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  socialLinks: z.object({
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    website: z.string().url().optional()
  }).optional()
});

// Mock user database (replace with actual DB implementation)
const users = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    bio: 'Full Stack Developer',
    avatar: 'https://example.com/avatar.jpg',
    socialLinks: {
      github: 'https://github.com/demouser',
      linkedin: 'https://linkedin.com/in/demouser'
    },
    createdAt: new Date().toISOString()
  }
];

// Get user profile
router.get('/:id', (req, res) => {
  // In a real implementation, this would check if the authenticated user has permission
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Don't return sensitive information
  const { password, ...userProfile } = user;
  res.json(userProfile);
});

// Update user profile
router.put('/:id', (req, res) => {
  try {
    // In a real implementation, this would check if the authenticated user has permission
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Validate request body
    const validatedData = userUpdateSchema.parse(req.body);
    
    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated user (mock implementation)
    users[userIndex] = updatedUser;
    
    // Don't return sensitive information
    const { password, ...userProfile } = updatedUser;
    res.json(userProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user portfolios
router.get('/:id/portfolios', (req, res) => {
  // This would fetch portfolios for the specified user
  // For now, just return an empty array
  res.json([]);
});

export default router;
