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

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Define the Template type to match the schema
type Template = {
  id: string;
  name: string;
  description: string;
  category: 'developer' | 'designer' | 'student' | 'freelancer' | 'photographer';
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

// Mock template database (replace with actual DB implementation)
const templates: Template[] = [
  // Template 1: Developer Portfolio
  {
    id: '1',
    name: 'Developer Portfolio',
    description: 'A clean, modern template for software developers to showcase their skills and projects.',
    category: 'developer',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjM2Y1MWI1Ij48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzNmNTFiNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPkRldmVsb3BlciBUZW1wbGF0ZTwvdGV4dD48L3N2Zz4=',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Software Developer',
          bio: 'I am a passionate software developer with expertise in web technologies and application development.',
          image: 'https://via.placeholder.com/400x400?text=Developer'
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
    description: 'An elegant template for graphic designers and UI/UX specialists to showcase their creative work.',
    category: 'designer',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjUwMDU3Ij48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1MDA1NyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPkRlc2lnbmVyIFRlbXBsYXRlPC90ZXh0Pjwvc3ZnPg==',
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
  },
  {
    id: '3',
    name: 'Photographer Portfolio',
    description: 'A visually stunning template for photographers to showcase their work and services.',
    category: 'photographer',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOWMyN2IwIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzljMjdiMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPlBob3RvZ3JhcGhlciBUZW1wbGF0ZTwvdGV4dD48L3N2Zz4=',
    sections: [
      {
        id: generateId(),
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
        id: generateId(),
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
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Book a Session',
        content: {
          email: 'photo@example.com',
          phone: '+1 (123) 456-7890',
          location: 'New York, NY',
          showContactForm: true
        },
        order: 2,
        layout: 'full'
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
    id: '4',
    name: 'Student Portfolio',
    description: 'A professional template for students to showcase their academic achievements and projects.',
    category: 'student',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNGNhZjUwIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPlN0dWRlbnQgVGVtcGxhdGU8L3RleHQ+PC9zdmc+',
    sections: [
      {
        id: generateId(),
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
        id: generateId(),
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
        id: generateId(),
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
    id: '5',
    name: 'Freelancer Portfolio',
    description: 'A versatile template for freelancers to showcase their services and previous work.',
    category: 'freelancer',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZmY5ODAwIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPkZyZWVsYW5jZXIgVGVtcGxhdGU8L3RleHQ+PC9zdmc+',
    sections: [
      {
        id: generateId(),
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
        id: generateId(),
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
        layout: 'half'
      },
      {
        id: generateId(),
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
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Hire Me',
        content: {
          email: 'freelancer@example.com',
          phone: '+1 (234) 567-8901',
          location: 'Remote',
          showContactForm: true
        },
        order: 3,
        layout: 'full'
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
    id: '6',
    name: 'Writer Portfolio',
    description: 'An elegant template for writers and content creators to showcase their work.',
    category: 'freelancer',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjE5NmYzIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPldyaXRlciBUZW1wbGF0ZTwvdGV4dD48L3N2Zz4=',
    sections: [
      {
        id: generateId(),
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
        id: generateId(),
        type: 'projects',
        title: 'Published Works',
        content: {
          projects: [
            {
              title: 'The Hidden Path',
              description: 'A novel exploring themes of self-discovery and adventure.',
              demoUrl: 'https://amazon.com/example-book',
              image: 'https://via.placeholder.com/600x400?text=Novel'
            },
            {
              title: 'Corporate Storytelling',
              description: 'A series of articles on effective brand narratives.',
              demoUrl: 'https://medium.com/@example',
              image: 'https://via.placeholder.com/600x400?text=Articles'
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
    category: 'designer',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZTkxZTYzIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U5MWU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPkFydGlzdCBUZW1wbGF0ZTwvdGV4dD48L3N2Zz4=',
    sections: [
      {
        id: generateId(),
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
        id: generateId(),
        type: 'projects',
        title: 'Gallery',
        content: {
          projects: [
            {
              title: 'Digital Dreams',
              description: 'A series exploring virtual reality and consciousness.',
              image: 'https://via.placeholder.com/600x400?text=Digital+Art'
            },
            {
              title: 'Urban Fragments',
              description: 'Mixed media collages inspired by city life.',
              image: 'https://via.placeholder.com/600x400?text=Mixed+Media'
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
    name: 'Musician Portfolio',
    description: 'A dynamic template for musicians to showcase their music, performances, and upcoming events.',
    category: 'freelancer',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNjczYWI3Ij48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzY3M2FiNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPk11c2ljaWFuIFRlbXBsYXRlPC90ZXh0Pjwvc3ZnPg==',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Independent Musician',
          bio: 'I create original music that blends electronic and acoustic elements into unique soundscapes.',
          image: 'https://via.placeholder.com/400x400?text=Musician'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Music',
        content: {
          projects: [
            {
              title: 'Echoes of Tomorrow',
              description: 'My latest album featuring 10 original tracks.',
              demoUrl: 'https://spotify.com/example-album',
              image: 'https://via.placeholder.com/600x400?text=Album'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      },
      {
        id: generateId(),
        type: 'blog',
        title: 'Upcoming Shows',
        content: {
          posts: [
            {
              title: 'Summer Tour 2023',
              excerpt: 'Catch me live in 10 cities across the country this summer.',
              date: '2023-05-15',
              url: 'https://example.com/events/summer-tour'
            }
          ]
        },
        order: 2,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'dark',
      primaryColor: '#f56565',
      secondaryColor: '#fed7d7',
      fontFamily: 'Oswald, sans-serif',
      fontSize: '16px'
    },
    isFeatured: false,
    isPublic: true
  },
  {
    id: '9',
    name: 'Teacher Portfolio',
    description: 'A professional template for educators to showcase their teaching philosophy and resources.',
    category: 'student',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMDA5Njg4Ij48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzAwOTY4OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPlRlYWNoZXIgVGVtcGxhdGU8L3RleHQ+PC9zdmc+',
    sections: [
      {
        id: generateId(),
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
        id: generateId(),
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
        layout: 'half'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Teaching Resources',
        content: {
          projects: [
            {
              title: 'Interactive Physics Labs',
              description: 'A collection of hands-on experiments for high school students.',
              demoUrl: 'https://teacherspayteachers.com/example',
              image: 'https://via.placeholder.com/600x400?text=Physics+Labs'
            }
          ]
        },
        order: 2,
        layout: 'two-columns'
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
    name: 'Entrepreneur Portfolio',
    description: 'A bold template for entrepreneurs and business owners to showcase their ventures and achievements.',
    category: 'freelancer',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZmY1NzIyIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2ZmNTcyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPkVudHJlcHJlbmV1ciBUZW1wbGF0ZTwvdGV4dD48L3N2Zz4=',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Tech Entrepreneur',
          bio: 'I build and scale innovative businesses that solve real-world problems.',
          image: 'https://via.placeholder.com/400x400?text=Entrepreneur'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Ventures',
        content: {
          projects: [
            {
              title: 'GreenTech Solutions',
              description: 'A startup developing sustainable energy solutions for homes.',
              demoUrl: 'https://greentechsolutions.example.com',
              image: 'https://via.placeholder.com/600x400?text=GreenTech'
            },
            {
              title: 'FinanceApp',
              description: 'A personal finance management application with over 100,000 users.',
              demoUrl: 'https://financeapp.example.com',
              image: 'https://via.placeholder.com/600x400?text=FinanceApp'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      },
      {
        id: generateId(),
        type: 'testimonials',
        title: 'Testimonials',
        content: {
          testimonials: [
            {
              quote: 'An innovative thinker with exceptional business acumen.',
              author: 'Jane Smith, Venture Capitalist',
              company: 'Invest Partners LLC'
            },
            {
              quote: 'Transformed our approach to sustainability with creative solutions.',
              author: 'John Doe, CEO',
              company: 'EcoFriendly Corp'
            }
          ]
        },
        order: 2,
        layout: 'full'
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
  }
];

// Export the templates array for use in other modules
export const getTemplates = () => templates;

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
  
  // Add debug logging
  console.log('Template found with ID:', req.params.id);
  
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
    } as Template;
    
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
      ...templates[templateIndex] as any,
      ...validatedData,
      updatedAt: new Date().toISOString()
    } as Template;
    
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
