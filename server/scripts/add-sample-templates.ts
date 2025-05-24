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

// Sample templates data - Part 1 (Templates 1-2)
const sampleTemplates = [
  // Template 1: Developer Portfolio
  {
    name: 'Developer Portfolio',
    description: 'A clean, modern template for software developers to showcase their skills and projects.',
    category: 'developer',
    thumbnail: 'https://via.placeholder.com/600x400?text=Developer+Template',
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
        order: 1,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'skills',
        title: 'Technical Skills',
        content: {
          skills: [
            { name: 'JavaScript', level: 90 },
            { name: 'React', level: 85 },
            { name: 'Node.js', level: 80 },
            { name: 'TypeScript', level: 75 },
            { name: 'MongoDB', level: 70 }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'Projects',
        content: {
          projects: [
            {
              title: 'E-commerce Platform',
              description: 'A full-stack e-commerce platform built with React and Node.js.',
              image: 'https://via.placeholder.com/600x400?text=Project+1',
              link: '#'
            },
            {
              title: 'Task Management App',
              description: 'A productivity app for managing tasks and projects.',
              image: 'https://via.placeholder.com/600x400?text=Project+2',
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
        title: 'Contact Me',
        content: {
          email: 'example@email.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            github: 'https://github.com/',
            linkedin: 'https://linkedin.com/'
          }
        },
        order: 4,
        layout: 'full'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#3490dc',
      secondaryColor: '#6574cd',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  },
  
  // Template 2: Designer Portfolio
  {
    name: 'Designer Portfolio',
    description: 'An elegant template for graphic designers and UI/UX specialists to showcase their creative work.',
    category: 'designer',
    thumbnail: 'https://via.placeholder.com/600x400?text=Designer+Template',
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: 'UI/UX Designer',
          bio: 'I create beautiful, intuitive designs that enhance user experience and solve real problems.',
          image: 'https://via.placeholder.com/400x400?text=Designer'
        },
        order: 1,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'My Work',
        content: {
          projects: [
            {
              title: 'Mobile App Redesign',
              description: 'Complete UI overhaul for a fitness tracking application.',
              image: 'https://via.placeholder.com/600x400?text=Design+1',
              link: '#'
            },
            {
              title: 'Brand Identity',
              description: 'Brand identity design for a sustainable fashion company.',
              image: 'https://via.placeholder.com/600x400?text=Design+2',
              link: '#'
            },
            {
              title: 'Website Design',
              description: 'Responsive website design for a tech startup.',
              image: 'https://via.placeholder.com/600x400?text=Design+3',
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
        title: 'Design Skills',
        content: {
          skills: [
            { name: 'UI Design', level: 95 },
            { name: 'UX Research', level: 85 },
            { name: 'Adobe Creative Suite', level: 90 },
            { name: 'Figma', level: 95 },
            { name: 'Prototyping', level: 80 }
          ]
        },
        order: 3,
        layout: 'half'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Get In Touch',
        content: {
          email: 'designer@email.com',
          phone: '+1 (123) 456-7890',
          socialLinks: {
            behance: 'https://behance.net/',
            dribbble: 'https://dribbble.com/'
          }
        },
        order: 4,
        layout: 'half'
      }
    ],
    theme: {
      mode: 'light',
      primaryColor: '#f56565',
      secondaryColor: '#ed64a6',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '16px'
    },
    isFeatured: true,
    isPublic: true
  }
];

// Function to add templates to the database
const addTemplates = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');
    
    // Add new templates
    const result = await Template.insertMany(sampleTemplates);
    console.log(`Added ${result.length} templates to the database`);
    
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
addTemplates();
