import express from 'express';
import { z } from 'zod';
import { categoryTemplates } from '../scripts/add-template-categories';

const router = express.Router();

// Template schema validation
const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(['developer', 'designer', 'student', 'freelancer', 'photographer', 'writer', 'artist', 'business', 'educator', 'healthcare']),
  thumbnail: z.string().min(1),
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

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Define the Template type to match the schema
type Template = {
  id: string;
  name: string;
  description: string;
  category: 'developer' | 'designer' | 'student' | 'freelancer' | 'photographer' | 'writer' | 'artist' | 'business' | 'educator' | 'healthcare';
  thumbnail: string;
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
  isFeatured: boolean;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Use category templates as our main template source
const templates: Template[] = [
  // Include our category templates
  ...categoryTemplates,
  // Additional specialized templates
  {
    id: '21',
    name: 'Senior Developer Portfolio',
    description: 'An advanced template for senior software developers and tech leads.',
    category: 'developer',
    thumbnail: '/images/templates/developer.png',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Senior Software Developer',
          bio: 'I am an experienced senior software developer and tech lead with expertise in full-stack development.',
          image: 'https://via.placeholder.com/400x400?text=Senior+Dev'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'projects-21',
        type: 'projects',
        title: 'Key Projects',
        content: {
          projects: [
            {
              title: 'Enterprise Platform',
              description: 'Large-scale enterprise software solution',
              technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
              githubUrl: 'https://github.com/example/enterprise',
              demoUrl: 'https://enterprise-demo.example.com',
              image: 'https://via.placeholder.com/600x400?text=Enterprise+Platform'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      },
      {
        id: 'skills-21',
        type: 'skills',
        title: 'Technical Skills',
        content: {
          skills: [
            { name: 'JavaScript/TypeScript', level: 95 },
            { name: 'System Architecture', level: 90 },
            { name: 'Team Leadership', level: 85 },
            { name: 'DevOps', level: 80 }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: 'contact-21',
        type: 'contact',
        title: 'Get in Touch',
        content: {
          email: 'senior@example.com',
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
      primaryColor: '#1a202c',
      secondaryColor: '#4299e1',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  },
  {
    id: '2',
    name: 'Designer Portfolio',
    description: 'An elegant template for graphic designers and UI/UX specialists to showcase their creative work.',
    category: 'designer',
    thumbnail: '/images/templates/designer.png',
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

// Export the templates array for use in other modules
export const getTemplates = () => templates;

// Get all templates
router.get('/', (req, res) => {
  try {
    console.log('GET /templates request received');

    // Filter by category if provided
    const { category } = req.query;

    if (category) {
      console.log('Filtering templates by category:', category);
      const filteredTemplates = templates.filter(t => t.category === String(category) && t.isPublic);
      console.log(`Found ${filteredTemplates.length} templates for category ${category}`);
      return res.json(filteredTemplates);
    }

    // Return all public templates
    const publicTemplates = templates.filter(t => t.isPublic);
    console.log(`Returning ${publicTemplates.length} public templates`);
    return res.json(publicTemplates);
  } catch (error) {
    console.error('Error in GET /templates:', error);
    return res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) });
  }
});

// Get all available template categories
router.get('/categories', (req, res) => {
  try {
    console.log('GET /templates/categories request received');

    // Extract unique categories from templates
    const categories = Array.from(new Set(templates.filter(t => t.isPublic).map(t => t.category)));
    console.log(`Found ${categories.length} unique template categories`);

    return res.json(categories);
  } catch (error) {
    console.error('Error in GET /templates/categories:', error);
    return res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) });
  }
});

// Get a specific template
router.get('/:id', (req, res) => {
  try {
    console.log('GET /templates/:id request received for ID:', req.params.id);

    const template = templates.find(t => t.id === req.params.id && t.isPublic);
    if (!template) {
      console.log('Template not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Template not found' });
    }

    console.log('Template found with ID:', req.params.id);
    return res.json(template);
  } catch (error) {
    console.error('Error in GET /templates/:id:', error);
    return res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
