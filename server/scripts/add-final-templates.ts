import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Template } from '../models/mongoose-schema';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      console.error('No DATABASE_URL provided');
      process.exit(1);
    }
    
    await mongoose.connect(DATABASE_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Sample templates data - Part 3 (Templates 7-10)
const finalTemplates = [
  // Template 7: Architect Portfolio
  {
    name: 'Architect Portfolio',
    description: 'A sophisticated template for architects to showcase their designs and projects.',
    category: 'architect',
    thumbnail: 'https://via.placeholder.com/600x400?text=Architecture+Template',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Architect & Designer',
          bio: 'I create functional, sustainable, and aesthetically pleasing spaces that enhance the way people live and work.',
          image: 'https://via.placeholder.com/400x400?text=Architect'
        },
        order: 1,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Featured Projects',
        content: {
          projects: [
            {
              title: 'Modern Residential Complex',
              description: 'Award-winning design for a sustainable residential complex.',
              image: 'https://via.placeholder.com/600x400?text=Architecture1',
              link: '#'
            },
            {
              title: 'Corporate Headquarters',
              description: 'Contemporary office space designed for collaboration and productivity.',
              image: 'https://via.placeholder.com/600x400?text=Architecture2',
              link: '#'
            },
            {
              title: 'Urban Renewal Project',
              description: 'Revitalization of a historic district with modern amenities.',
              image: 'https://via.placeholder.com/600x400?text=Architecture3',
              link: '#'
            }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'skills',
        title: 'Expertise',
        content: {
          skills: [
            { name: 'Architectural Design', level: 95 },
            { name: 'Sustainable Design', level: 90 },
            { name: '3D Modeling', level: 85 },
            { name: 'AutoCAD', level: 90 },
            { name: 'Project Management', level: 80 }
          ]
        },
        order: 3,
        layout: 'half'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Contact',
        content: {
          email: 'architect@example.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            linkedin: 'https://linkedin.com/',
            instagram: 'https://instagram.com/'
          }
        },
        order: 4,
        layout: 'half'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#805ad5',
      secondaryColor: '#9f7aea',
      fontFamily: 'Raleway, sans-serif',
      fontSize: '16px'
    },
    isFeatured: false,
    isPublic: true
  },
  
  // Template 8: Freelancer Portfolio
  {
    name: 'Freelancer Portfolio',
    description: 'A versatile template for freelancers to showcase their services and projects.',
    category: 'freelancer',
    thumbnail: 'https://via.placeholder.com/600x400?text=Freelancer+Template',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Independent Professional',
          bio: 'I provide high-quality services tailored to meet the unique needs of each client.',
          image: 'https://via.placeholder.com/400x400?text=Freelancer'
        },
        order: 1,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'skills',
        title: 'Services',
        content: {
          skills: [
            { name: 'Web Development', level: 90 },
            { name: 'Content Creation', level: 85 },
            { name: 'Digital Marketing', level: 80 },
            { name: 'Graphic Design', level: 85 },
            { name: 'Consulting', level: 90 }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Recent Work',
        content: {
          projects: [
            {
              title: 'E-commerce Website',
              description: 'Complete online store development for a boutique retailer.',
              image: 'https://via.placeholder.com/600x400?text=Freelance1',
              link: '#'
            },
            {
              title: 'Marketing Campaign',
              description: 'Comprehensive digital marketing strategy for a startup.',
              image: 'https://via.placeholder.com/600x400?text=Freelance2',
              link: '#'
            },
            {
              title: 'Brand Identity',
              description: 'Logo and brand identity design for a new business.',
              image: 'https://via.placeholder.com/600x400?text=Freelance3',
              link: '#'
            }
          ]
        },
        order: 3,
        layout: 'two-columns'
      },
      {
        id: generateId(),
        type: 'testimonials',
        title: 'Client Feedback',
        content: {
          testimonials: [
            {
              name: 'Alex Rodriguez',
              text: 'Exceptional work and communication throughout the project. Highly recommended!',
              image: 'https://via.placeholder.com/100x100?text=Client1'
            },
            {
              name: 'Jamie Lee',
              text: 'Delivered beyond expectations and on time. Will definitely work with again.',
              image: 'https://via.placeholder.com/100x100?text=Client2'
            }
          ]
        },
        order: 4,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Hire Me',
        content: {
          email: 'freelancer@example.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            linkedin: 'https://linkedin.com/',
            twitter: 'https://twitter.com/'
          }
        },
        order: 5,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#dd6b20',
      secondaryColor: '#ed8936',
      fontFamily: 'Open Sans, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  },
  
  // Template 9: Artist Portfolio
  {
    name: 'Artist Portfolio',
    description: 'A creative template for visual artists to showcase their artwork and exhibitions.',
    category: 'artist',
    thumbnail: 'https://via.placeholder.com/600x400?text=Artist+Template',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Visual Artist',
          bio: 'I explore themes of identity and nature through various mediums including painting, sculpture, and digital art.',
          image: 'https://via.placeholder.com/400x400?text=Artist'
        },
        order: 1,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Gallery',
        content: {
          projects: [
            {
              title: 'Abstract Series',
              description: 'Exploration of color and form through abstract expressionism.',
              image: 'https://via.placeholder.com/600x400?text=Art1',
              link: '#'
            },
            {
              title: 'Portrait Collection',
              description: 'Contemporary portraits examining human emotion.',
              image: 'https://via.placeholder.com/600x400?text=Art2',
              link: '#'
            },
            {
              title: 'Digital Illustrations',
              description: 'Modern digital artwork exploring futuristic themes.',
              image: 'https://via.placeholder.com/600x400?text=Art3',
              link: '#'
            },
            {
              title: 'Sculpture Series',
              description: 'Three-dimensional works exploring form and texture.',
              image: 'https://via.placeholder.com/600x400?text=Art4',
              link: '#'
            }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'resume',
        title: 'Exhibitions & Awards',
        content: {
          experiences: [
            {
              title: 'Solo Exhibition',
              organization: 'Contemporary Art Gallery',
              date: '2025',
              description: 'Featured collection of recent works exploring themes of identity.'
            },
            {
              title: 'Group Exhibition',
              organization: 'International Art Fair',
              date: '2024',
              description: 'Selected to showcase alongside leading contemporary artists.'
            },
            {
              title: 'Art Prize Finalist',
              organization: 'National Art Foundation',
              date: '2023',
              description: 'Recognized for innovation in mixed media artwork.'
            }
          ]
        },
        order: 3,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Contact',
        content: {
          email: 'artist@example.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            instagram: 'https://instagram.com/',
            artstation: 'https://artstation.com/'
          }
        },
        order: 4,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'dark',
      primaryColor: '#d53f8c',
      secondaryColor: '#ed64a6',
      fontFamily: 'Josefin Sans, sans-serif',
      fontSize: '16px'
    },
    isFeatured: false,
    isPublic: true
  },
  
  // Template 10: Consultant Portfolio
  {
    name: 'Consultant Portfolio',
    description: 'A professional template for business consultants to showcase their expertise and services.',
    category: 'consultant',
    thumbnail: 'https://via.placeholder.com/600x400?text=Consultant+Template',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Business Consultant',
          bio: 'I help businesses identify challenges, implement solutions, and achieve sustainable growth.',
          image: 'https://via.placeholder.com/400x400?text=Consultant'
        },
        order: 1,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'skills',
        title: 'Areas of Expertise',
        content: {
          skills: [
            { name: 'Strategic Planning', level: 95 },
            { name: 'Business Development', level: 90 },
            { name: 'Process Optimization', level: 85 },
            { name: 'Change Management', level: 90 },
            { name: 'Financial Analysis', level: 85 }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Case Studies',
        content: {
          projects: [
            {
              title: 'Business Transformation',
              description: 'Guided a mid-size company through digital transformation, increasing efficiency by 35%.',
              image: 'https://via.placeholder.com/600x400?text=Consulting1',
              link: '#'
            },
            {
              title: 'Market Expansion Strategy',
              description: 'Developed and implemented a strategy for international market entry, resulting in 45% revenue growth.',
              image: 'https://via.placeholder.com/600x400?text=Consulting2',
              link: '#'
            },
            {
              title: 'Operational Efficiency',
              description: 'Streamlined operations for a manufacturing client, reducing costs by 25%.',
              image: 'https://via.placeholder.com/600x400?text=Consulting3',
              link: '#'
            }
          ]
        },
        order: 3,
        layout: 'two-columns'
      },
      {
        id: generateId(),
        type: 'testimonials',
        title: 'Client Testimonials',
        content: {
          testimonials: [
            {
              name: 'Robert Smith',
              text: 'The strategic insights provided were invaluable to our company\'s growth.',
              image: 'https://via.placeholder.com/100x100?text=CEO'
            },
            {
              name: 'Lisa Johnson',
              text: 'Professional, thorough, and delivered measurable results for our business.',
              image: 'https://via.placeholder.com/100x100?text=CFO'
            }
          ]
        },
        order: 4,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Schedule a Consultation',
        content: {
          email: 'consultant@example.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            linkedin: 'https://linkedin.com/',
            twitter: 'https://twitter.com/'
          }
        },
        order: 5,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#2b6cb0',
      secondaryColor: '#4299e1',
      fontFamily: 'Lato, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  }
];

// Function to add templates to the database
const addFinalTemplates = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Add new templates
    const result = await Template.insertMany(finalTemplates);
    console.log(`Added ${result.length} final templates to the database`);
    
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding templates:', error);
    process.exit(1);
  }
};

// Run the function
addFinalTemplates();
