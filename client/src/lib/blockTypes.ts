import { BlockType } from '../types/block';

// Function to get human-readable labels for block types
export const getBlockLabels = (type: BlockType): string => {
  const labels: Record<BlockType, string> = {
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    contact: 'Contact',
    text: 'Text',
    image: 'Image',
    resume: 'Resume',
    testimonials: 'Testimonials',
    blog: 'Blog',
    services: 'Services',
    gallery: 'Gallery'
  };
  
  return labels[type] || 'Block';
};

// Function to get default content for each block type
export const getDefaultBlockContent = (type: BlockType): any => {
  switch (type) {
    case 'about':
      return {
        headline: 'About Me',
        bio: 'Write your bio here...',
        image: ''
      };
    case 'projects':
      return {
        projects: [
          {
            title: 'Project Title',
            description: 'Project description goes here...',
            image: '',
            technologies: ['Tech 1', 'Tech 2'],
            githubUrl: '',
            demoUrl: ''
          }
        ]
      };
    case 'skills':
      return {
        skills: [
          { name: 'Skill 1', level: 90 },
          { name: 'Skill 2', level: 75 },
          { name: 'Skill 3', level: 80 }
        ]
      };
    case 'contact':
      return {
        email: 'your.email@example.com',
        phone: '+1 123 456 7890',
        location: 'City, Country',
        socialLinks: {
          linkedin: '',
          github: '',
          twitter: ''
        }
      };
    case 'text':
      return {
        content: 'Add your text content here...'
      };
    case 'image':
      return {
        url: '',
        alt: 'Image description',
        caption: ''
      };
    case 'resume':
      return {
        education: [],
        experience: [],
        fileUrl: ''
      };
    case 'testimonials':
      return {
        testimonials: [
          {
            quote: 'Testimonial quote goes here...',
            author: 'Author Name',
            role: 'Role/Company',
            avatar: ''
          }
        ]
      };
    case 'blog':
      return {
        posts: []
      };
    case 'services':
      return {
        services: [
          {
            title: 'Service Title',
            description: 'Service description goes here...',
            icon: ''
          }
        ]
      };
    case 'gallery':
      return {
        images: []
      };
    default:
      return {};
  }
};
