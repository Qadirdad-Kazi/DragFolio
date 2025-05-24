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

// Sample templates data - Part 2 (Templates 3-6)
const moreTemplates = [
  // Template 3: Photographer Portfolio
  {
    name: 'Photographer Portfolio',
    description: 'A visually stunning template for photographers to showcase their work and services.',
    category: 'photographer',
    thumbnail: 'https://via.placeholder.com/600x400?text=Photography+Template',
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
              title: 'Portrait Photography',
              description: 'Capturing the essence and personality of individuals.',
              image: 'https://via.placeholder.com/600x400?text=Portrait',
              link: '#'
            },
            {
              title: 'Landscape Photography',
              description: 'Breathtaking natural landscapes from around the world.',
              image: 'https://via.placeholder.com/600x400?text=Landscape',
              link: '#'
            },
            {
              title: 'Event Photography',
              description: 'Documenting special moments from weddings and events.',
              image: 'https://via.placeholder.com/600x400?text=Event',
              link: '#'
            },
            {
              title: 'Street Photography',
              description: 'Candid moments capturing urban life and culture.',
              image: 'https://via.placeholder.com/600x400?text=Street',
              link: '#'
            }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'testimonials',
        title: 'Client Testimonials',
        content: {
          testimonials: [
            {
              name: 'Sarah Johnson',
              text: 'The photos captured our wedding day perfectly. We couldn\'t be happier!',
              image: 'https://via.placeholder.com/100x100?text=Client1'
            },
            {
              name: 'Michael Chen',
              text: 'Professional, creative, and a pleasure to work with. Highly recommended!',
              image: 'https://via.placeholder.com/100x100?text=Client2'
            }
          ]
        },
        order: 3,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Book a Session',
        content: {
          email: 'photo@example.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            instagram: 'https://instagram.com/',
            facebook: 'https://facebook.com/'
          }
        },
        order: 4,
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
  
  // Template 4: Writer/Blogger Portfolio
  {
    name: 'Writer Portfolio',
    description: 'An elegant template for writers, bloggers, and content creators to showcase their work.',
    category: 'writer',
    thumbnail: 'https://via.placeholder.com/600x400?text=Writer+Template',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Writer & Content Creator',
          bio: 'I craft compelling stories and content that engage, inform, and inspire readers.',
          image: 'https://via.placeholder.com/400x400?text=Writer'
        },
        order: 1,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'blog',
        title: 'Featured Articles',
        content: {
          articles: [
            {
              title: 'The Art of Storytelling',
              excerpt: 'Exploring the elements that make stories resonate with readers.',
              date: '2025-03-15',
              image: 'https://via.placeholder.com/600x400?text=Article1',
              link: '#'
            },
            {
              title: 'Finding Your Voice',
              excerpt: 'Developing a unique writing style that sets you apart.',
              date: '2025-02-28',
              image: 'https://via.placeholder.com/600x400?text=Article2',
              link: '#'
            },
            {
              title: 'The Future of Digital Content',
              excerpt: 'How technology is changing the way we create and consume content.',
              date: '2025-01-10',
              image: 'https://via.placeholder.com/600x400?text=Article3',
              link: '#'
            }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Published Works',
        content: {
          projects: [
            {
              title: 'E-Book: Creative Writing Guide',
              description: 'A comprehensive guide to improving your creative writing skills.',
              image: 'https://via.placeholder.com/600x400?text=Book1',
              link: '#'
            },
            {
              title: 'Magazine Features',
              description: 'Articles published in leading industry magazines.',
              image: 'https://via.placeholder.com/600x400?text=Magazine',
              link: '#'
            }
          ]
        },
        order: 3,
        layout: 'two-columns'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Get In Touch',
        content: {
          email: 'writer@example.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            twitter: 'https://twitter.com/',
            medium: 'https://medium.com/'
          }
        },
        order: 4,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#718096',
      secondaryColor: '#a0aec0',
      fontFamily: 'Merriweather, serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  },
  
  // Template 5: Marketing Professional
  {
    name: 'Marketing Portfolio',
    description: 'A dynamic template for marketing professionals to showcase their campaigns and results.',
    category: 'marketing',
    thumbnail: 'https://via.placeholder.com/600x400?text=Marketing+Template',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Marketing Strategist',
          bio: 'I develop and execute marketing strategies that drive growth and engagement for brands.',
          image: 'https://via.placeholder.com/400x400?text=Marketer'
        },
        order: 1,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Case Studies',
        content: {
          projects: [
            {
              title: 'Brand Relaunch Campaign',
              description: 'Increased brand awareness by 45% through integrated marketing campaign.',
              image: 'https://via.placeholder.com/600x400?text=Campaign1',
              link: '#'
            },
            {
              title: 'Social Media Strategy',
              description: 'Grew social media engagement by 78% and followers by 50% in 6 months.',
              image: 'https://via.placeholder.com/600x400?text=Campaign2',
              link: '#'
            },
            {
              title: 'Product Launch',
              description: 'Successful product launch resulting in 10,000 sales in the first month.',
              image: 'https://via.placeholder.com/600x400?text=Campaign3',
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
        title: 'Marketing Skills',
        content: {
          skills: [
            { name: 'Digital Marketing', level: 95 },
            { name: 'Content Strategy', level: 90 },
            { name: 'Social Media', level: 85 },
            { name: 'SEO/SEM', level: 80 },
            { name: 'Analytics', level: 85 }
          ]
        },
        order: 3,
        layout: 'half'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Contact Me',
        content: {
          email: 'marketer@example.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            linkedin: 'https://linkedin.com/',
            twitter: 'https://twitter.com/'
          }
        },
        order: 4,
        layout: 'half'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#38a169',
      secondaryColor: '#48bb78',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '16px'
    },
    isFeatured: false,
    isPublic: true
  },
  
  // Template 6: Data Scientist
  {
    name: 'Data Scientist Portfolio',
    description: 'A professional template for data scientists to showcase their projects and expertise.',
    category: 'data-scientist',
    thumbnail: 'https://via.placeholder.com/600x400?text=Data+Science+Template',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'Data Scientist & Analyst',
          bio: 'I transform complex data into actionable insights that drive business decisions.',
          image: 'https://via.placeholder.com/400x400?text=DataScientist'
        },
        order: 1,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'skills',
        title: 'Technical Skills',
        content: {
          skills: [
            { name: 'Python', level: 95 },
            { name: 'Machine Learning', level: 90 },
            { name: 'Data Visualization', level: 85 },
            { name: 'SQL', level: 90 },
            { name: 'Statistical Analysis', level: 85 },
            { name: 'Big Data Technologies', level: 80 }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Data Projects',
        content: {
          projects: [
            {
              title: 'Predictive Analytics Model',
              description: 'Developed a machine learning model to predict customer churn with 92% accuracy.',
              image: 'https://via.placeholder.com/600x400?text=DataProject1',
              link: '#'
            },
            {
              title: 'Data Visualization Dashboard',
              description: 'Created an interactive dashboard for real-time business metrics tracking.',
              image: 'https://via.placeholder.com/600x400?text=DataProject2',
              link: '#'
            },
            {
              title: 'Natural Language Processing',
              description: 'Built a sentiment analysis tool for customer feedback processing.',
              image: 'https://via.placeholder.com/600x400?text=DataProject3',
              link: '#'
            }
          ]
        },
        order: 3,
        layout: 'two-columns'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Contact Information',
        content: {
          email: 'datascientist@example.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            github: 'https://github.com/',
            linkedin: 'https://linkedin.com/',
            kaggle: 'https://kaggle.com/'
          }
        },
        order: 4,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#4299e1',
      secondaryColor: '#63b3ed',
      fontFamily: 'Roboto, sans-serif',
      fontSize: '16px'
    },
    isFeatured: false,
    isPublic: true
  }
];

// Function to add templates to the database
const addMoreTemplates = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Add new templates
    const result = await Template.insertMany(moreTemplates);
    console.log(`Added ${result.length} more templates to the database`);
    
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
addMoreTemplates();
