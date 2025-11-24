import express from 'express';
import { z } from 'zod';

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

// Hardcoded templates - no duplicates
const templates: Template[] = [
  {
    id: '1',
    name: 'Developer Portfolio',
    description: 'A modern template for software developers to showcase their coding skills and projects.',
    category: 'developer',
    thumbnail: '/images/templates/developer.png',
    sections: [
      {
        id: 'about-dev',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Software Developer',
          bio: 'I am a passionate software developer with expertise in full-stack development and modern web technologies.',
          image: 'https://via.placeholder.com/400x400?text=Developer'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'projects-dev',
        type: 'projects',
        title: 'My Projects',
        content: {
          projects: [
            {
              title: 'E-commerce Platform',
              description: 'Full-stack e-commerce solution with React and Node.js',
              technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
              githubUrl: 'https://github.com/example/ecommerce',
              demoUrl: 'https://ecommerce-demo.example.com',
              image: 'https://via.placeholder.com/600x400?text=E-commerce'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      },
      {
        id: 'skills-dev',
        type: 'skills',
        title: 'Technical Skills',
        content: {
          skills: [
            { name: 'JavaScript', level: 95 },
            { name: 'React', level: 90 },
            { name: 'Node.js', level: 85 },
            { name: 'TypeScript', level: 80 }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: 'contact-dev',
        type: 'contact',
        title: 'Contact Me',
        content: {
          email: 'developer@example.com',
          phone: '+1 (555) 123-4567',
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
    description: 'An elegant template for graphic designers and UI/UX specialists to showcase their creative work.',
    category: 'designer',
    thumbnail: '/images/templates/designer.png',
    sections: [
      {
        id: 'about-des',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'UI/UX Designer',
          bio: 'I create beautiful, intuitive interfaces for web and mobile applications.',
          image: 'https://via.placeholder.com/400x400?text=Designer'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'projects-des',
        type: 'projects',
        title: 'My Work',
        content: {
          projects: [
            {
              title: 'Mobile App Redesign',
              description: 'Complete redesign of a fitness tracking app',
              technologies: ['Figma', 'Adobe XD', 'Illustrator'],
              demoUrl: 'https://behance.net/example/fitness-app',
              image: 'https://via.placeholder.com/600x400?text=App+Design'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      },
      {
        id: 'contact-des',
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
  },
  {
    id: '3',
    name: 'Student Portfolio',
    description: 'A professional template for students to showcase their academic achievements and projects.',
    category: 'student',
    thumbnail: '/images/templates/student.png',
    sections: [
      {
        id: 'about-stu',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Computer Science Student',
          bio: 'I am a dedicated student with a passion for learning and applying new technologies.',
          image: 'https://via.placeholder.com/400x400?text=Student'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'skills-stu',
        type: 'skills',
        title: 'Skills & Courses',
        content: {
          skills: [
            { name: 'Programming', level: 80 },
            { name: 'Data Analysis', level: 75 },
            { name: 'UI/UX Design', level: 70 },
            { name: 'Project Management', level: 65 }
          ]
        },
        order: 1,
        layout: 'full'
      },
      {
        id: 'projects-stu',
        type: 'projects',
        title: 'Academic Projects',
        content: {
          projects: [
            {
              title: 'Machine Learning Research',
              description: 'Research on neural networks for image recognition.',
              technologies: ['Python', 'TensorFlow', 'Jupyter'],
              githubUrl: 'https://github.com/example/ml-research',
              image: 'https://via.placeholder.com/600x400?text=ML+Project'
            }
          ]
        },
        order: 2,
        layout: 'two-columns'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#4299e1',
      secondaryColor: '#ebf8ff',
      fontFamily: 'Roboto, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  },
  {
    id: '4',
    name: 'Freelancer Portfolio',
    description: 'A versatile template for freelancers to showcase their services and previous work.',
    category: 'freelancer',
    thumbnail: '/images/templates/freelancer.png',
    sections: [
      {
        id: 'about-free',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Freelance Web Developer',
          bio: 'I help businesses create modern, responsive websites that drive results.',
          image: 'https://via.placeholder.com/400x400?text=Freelancer'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'skills-free',
        type: 'skills',
        title: 'Services',
        content: {
          skills: [
            { name: 'Web Development', level: 95 },
            { name: 'E-commerce Solutions', level: 90 },
            { name: 'SEO Optimization', level: 85 },
            { name: 'Website Maintenance', level: 95 }
          ]
        },
        order: 1,
        layout: 'full'
      },
      {
        id: 'projects-free',
        type: 'projects',
        title: 'Recent Work',
        content: {
          projects: [
            {
              title: 'Restaurant Website',
              description: 'A responsive website for a local restaurant with online ordering.',
              technologies: ['HTML/CSS', 'JavaScript', 'PHP'],
              demoUrl: 'https://restaurant-demo.example.com',
              image: 'https://via.placeholder.com/600x400?text=Restaurant+Site'
            }
          ]
        },
        order: 2,
        layout: 'two-columns'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#38b2ac',
      secondaryColor: '#e6fffa',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  },
  {
    id: '5',
    name: 'Photographer Portfolio',
    description: 'A visually stunning template for photographers to showcase their work and services.',
    category: 'photographer',
    thumbnail: '/images/templates/photographer.png',
    sections: [
      {
        id: 'about-photo',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Professional Photographer',
          bio: 'I capture moments that tell stories and evoke emotions through my lens.',
          image: 'https://via.placeholder.com/400x400?text=Photographer'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'projects-photo',
        type: 'projects',
        title: 'Gallery',
        content: {
          projects: [
            {
              title: 'Portrait Photography',
              description: 'Capturing the essence and personality of individuals.',
              image: 'https://via.placeholder.com/600x400?text=Portrait'
            },
            {
              title: 'Landscape Photography',
              description: 'Breathtaking natural landscapes from around the world.',
              image: 'https://via.placeholder.com/600x400?text=Landscape'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      }
    ],
    theme: {
      mode: 'dark',
      primaryColor: '#2d3748',
      secondaryColor: '#4a5568',
      fontFamily: 'Playfair Display, serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  },
  {
    id: '6',
    name: 'Writer Portfolio',
    description: 'An elegant template for writers and content creators to showcase their work.',
    category: 'writer',
    thumbnail: '/images/templates/writer.png',
    sections: [
      {
        id: 'about-writer',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Professional Writer & Editor',
          bio: 'I craft compelling stories and content that engage readers and deliver messages effectively.',
          image: 'https://via.placeholder.com/400x400?text=Writer'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'projects-writer',
        type: 'projects',
        title: 'Published Works',
        content: {
          projects: [
            {
              title: 'The Hidden Path',
              description: 'A novel exploring themes of self-discovery and adventure.',
              demoUrl: 'https://amazon.com/example-book',
              image: 'https://via.placeholder.com/600x400?text=Novel'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#718096',
      secondaryColor: '#e2e8f0',
      fontFamily: 'Merriweather, serif',
      fontSize: '16px'
    },
    isFeatured: false,
    isPublic: true
  },
  {
    id: '7',
    name: 'Artist Portfolio',
    description: 'A visually rich template for artists to showcase their creative works and exhibitions.',
    category: 'artist',
    thumbnail: '/images/templates/artist.png',
    sections: [
      {
        id: 'about-artist',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Contemporary Artist',
          bio: 'I create mixed-media art that explores the intersection of technology and human emotion.',
          image: 'https://via.placeholder.com/400x400?text=Artist'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'projects-artist',
        type: 'projects',
        title: 'Gallery',
        content: {
          projects: [
            {
              title: 'Digital Dreams',
              description: 'A series exploring virtual reality and consciousness.',
              image: 'https://via.placeholder.com/600x400?text=Digital+Art'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      }
    ],
    theme: {
      mode: 'dark',
      primaryColor: '#805ad5',
      secondaryColor: '#d6bcfa',
      fontFamily: 'Raleway, sans-serif',
      fontSize: '16px'
    },
    isFeatured: false,
    isPublic: true
  },
  {
    id: '8',
    name: 'Business Portfolio',
    description: 'A professional template for business owners and entrepreneurs to showcase their ventures.',
    category: 'business',
    thumbnail: '/images/templates/business.png',
    sections: [
      {
        id: 'about-biz',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Business Owner',
          bio: 'I build and scale innovative businesses that solve real-world problems.',
          image: 'https://via.placeholder.com/400x400?text=Business'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'projects-biz',
        type: 'projects',
        title: 'Ventures',
        content: {
          projects: [
            {
              title: 'GreenTech Solutions',
              description: 'A startup developing sustainable energy solutions for homes.',
              demoUrl: 'https://greentechsolutions.example.com',
              image: 'https://via.placeholder.com/600x400?text=GreenTech'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#ed8936',
      secondaryColor: '#feebc8',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  },
  {
    id: '9',
    name: 'Educator Portfolio',
    description: 'A professional template for educators to showcase their teaching philosophy and resources.',
    category: 'educator',
    thumbnail: '/images/templates/educator.png',
    sections: [
      {
        id: 'about-edu',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Science Educator',
          bio: 'I am passionate about making science accessible and engaging for students of all ages.',
          image: 'https://via.placeholder.com/400x400?text=Teacher'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'skills-edu',
        type: 'skills',
        title: 'Expertise',
        content: {
          skills: [
            { name: 'Physics', level: 95 },
            { name: 'Chemistry', level: 90 },
            { name: 'STEM Education', level: 95 },
            { name: 'Curriculum Development', level: 85 }
          ]
        },
        order: 1,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#48bb78',
      secondaryColor: '#c6f6d5',
      fontFamily: 'Lato, sans-serif',
      fontSize: '16px'
    },
    isFeatured: false,
    isPublic: true
  },
  {
    id: '10',
    name: 'Healthcare Portfolio',
    description: 'A professional template for healthcare professionals to showcase their expertise and services.',
    category: 'healthcare',
    thumbnail: '/images/templates/healthcare.png',
    sections: [
      {
        id: 'about-health',
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Healthcare Professional',
          bio: 'I am dedicated to providing quality healthcare and improving patient outcomes.',
          image: 'https://via.placeholder.com/400x400?text=Healthcare'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: 'skills-health',
        type: 'skills',
        title: 'Specializations',
        content: {
          skills: [
            { name: 'Patient Care', level: 95 },
            { name: 'Medical Research', level: 85 },
            { name: 'Health Education', level: 90 },
            { name: 'Emergency Medicine', level: 80 }
          ]
        },
        order: 1,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#06b6d4',
      secondaryColor: '#a5f3fc',
      fontFamily: 'Nunito, sans-serif',
      fontSize: '16px'
    },
    isFeatured: false,
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
