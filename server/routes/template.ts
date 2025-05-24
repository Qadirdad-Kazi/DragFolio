import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Template schema validation
const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(['developer', 'designer', 'student', 'freelancer', 'photographer']),
  thumbnail: z.string().url(),
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['about', 'projects', 'skills', 'resume', 'testimonials', 'blog', 'contact']),
      title: z.string(),
      content: z.any(),
      order: z.number(),
      layout: z.enum(['full', 'half', 'two-columns']).default('full'),
      settings: z.record(z.any()).optional()
    })
  ),
  theme: z.object({
    mode: z.enum(['light', 'dark']).default('light'),
    primaryColor: z.string().default('#3490dc'),
    secondaryColor: z.string().default('#ffed4a'),
    fontFamily: z.string().default('Inter, sans-serif'),
    fontSize: z.string().default('16px')
  }),
  isFeatured: z.boolean().default(false),
  isPublic: z.boolean().default(true)
});

// Mock template database (replace with actual DB implementation)
const templates = [
  {
    id: '1',
    name: 'Developer Portfolio',
    description: 'A clean, modern template for software developers',
    category: 'developer',
    thumbnail: 'https://example.com/thumbnails/developer.jpg',
    sections: [
      {
        id: 'about-1',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Full Stack Developer',
          bio: 'I build modern web applications with React and Node.js',
          image: 'https://example.com/profile.jpg'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'projects-1',
        type: 'projects',
        title: 'My Projects',
        content: {
          projects: [
            {
              title: 'E-commerce Platform',
              description: 'A full-stack e-commerce solution',
              technologies: ['React', 'Node.js', 'MongoDB'],
              githubUrl: 'https://github.com/example/ecommerce',
              demoUrl: 'https://ecommerce-demo.example.com',
              image: 'https://example.com/projects/ecommerce.jpg'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      },
      {
        id: 'skills-1',
        type: 'skills',
        title: 'Skills',
        content: {
          skills: [
            { name: 'JavaScript', level: 90 },
            { name: 'React', level: 85 },
            { name: 'Node.js', level: 80 },
            { name: 'TypeScript', level: 75 }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: 'contact-1',
        type: 'contact',
        title: 'Contact Me',
        content: {
          email: 'example@example.com',
          phone: '+1 123 456 7890',
          location: 'San Francisco, CA',
          showContactForm: true
        },
        order: 3,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#3490dc',
      secondaryColor: '#ffed4a',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  },
  {
    id: '2',
    name: 'Designer Portfolio',
    description: 'A creative template for designers and artists',
    category: 'designer',
    thumbnail: 'https://example.com/thumbnails/designer.jpg',
    sections: [
      {
        id: 'about-1',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'UI/UX Designer',
          bio: 'I create beautiful, intuitive interfaces for web and mobile applications',
          image: 'https://example.com/profile-designer.jpg'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'projects-1',
        type: 'projects',
        title: 'My Work',
        content: {
          projects: [
            {
              title: 'Mobile App Redesign',
              description: 'Complete redesign of a fitness tracking app',
              technologies: ['Figma', 'Adobe XD', 'Illustrator'],
              demoUrl: 'https://behance.net/example/fitness-app',
              image: 'https://example.com/projects/fitness-app.jpg'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      },
      {
        id: 'contact-1',
        type: 'contact',
        title: 'Get in Touch',
        content: {
          email: 'designer@example.com',
          location: 'New York, NY',
          showContactForm: true
        },
        order: 2,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#f56565',
      secondaryColor: '#805ad5',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  }
];

// Get all templates
router.get('/', (req, res) => {
  // Filter by category if provided
  const { category } = req.query;
  
  if (category) {
    const filteredTemplates = templates.filter(t => t.category === category && t.isPublic);
    return res.json(filteredTemplates);
  }
  
  // Return all public templates
  const publicTemplates = templates.filter(t => t.isPublic);
  res.json(publicTemplates);
});

// Get a specific template
router.get('/:id', (req, res) => {
  const template = templates.find(t => t.id === req.params.id && t.isPublic);
  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }
  res.json(template);
});

// Admin: Create a new template
router.post('/', (req, res) => {
  try {
    // This would require admin authentication
    // Validate request body
    const validatedData = templateSchema.parse(req.body);
    
    // Create new template
    const newTemplate = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save template (mock implementation)
    templates.push(newTemplate);
    
    res.status(201).json(newTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update a template
router.put('/:id', (req, res) => {
  try {
    // This would require admin authentication
    // Find template
    const templateIndex = templates.findIndex(t => t.id === req.params.id);
    if (templateIndex === -1) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Validate request body
    const validatedData = templateSchema.parse(req.body);
    
    // Update template
    const updatedTemplate = {
      ...templates[templateIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated template (mock implementation)
    templates[templateIndex] = updatedTemplate;
    
    res.json(updatedTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Update template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete a template
router.delete('/:id', (req, res) => {
  // This would require admin authentication
  // Find template
  const templateIndex = templates.findIndex(t => t.id === req.params.id);
  if (templateIndex === -1) {
    return res.status(404).json({ message: 'Template not found' });
  }
  
  // Remove template (mock implementation)
  templates.splice(templateIndex, 1);
  
  res.status(204).send();
});

export default router;
