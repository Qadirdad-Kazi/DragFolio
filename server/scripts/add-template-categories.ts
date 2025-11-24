// Helper function to generate a unique ID
const generateId = (): string => Math.random().toString(36).substring(2, 15);

// Define the Template type to match the schema in template.ts
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

// Create 20 different template categories
const templateCategories = [
  'developer',
  'designer', 
  'student',
  'freelancer',
  'photographer',
  'writer',
  'artist',
  'business',
  'educator',
  'healthcare',
  'developer', // Modern Developer
  'designer',  // Creative Designer
  'student',   // Graduate Student
  'freelancer', // Digital Freelancer
  'photographer', // Portrait Photographer
  'writer',    // Content Writer
  'artist',    // Digital Artist
  'business',  // Startup Business
  'educator',  // Online Educator
  'healthcare' // Healthcare Professional
] as const;

// Type for our categories
type TemplateCategory = typeof templateCategories[number];

// Create templates for each category
const templates: Template[] = templateCategories.map((category, index) => {
  const id = (index + 1).toString(); // Start from 1
  
  // Create different variations for duplicate categories
  const variations = {
    10: 'Modern ',
    11: 'Creative ',
    12: 'Graduate ',
    13: 'Digital ',
    14: 'Portrait ',
    15: 'Content ',
    16: 'Digital ',
    17: 'Startup ',
    18: 'Online ',
    19: 'Healthcare '
  };
  
  const prefix = variations[index] || '';
  
  return {
    id,
    name: `${prefix}${category.charAt(0).toUpperCase() + category.slice(1)} Portfolio`,
    description: `A ${prefix.toLowerCase()}professional template for ${category}s to showcase their work and skills.`,
    category,
    thumbnail: `/images/templates/${category}.png`,
    sections: [
      {
        id: generateId(),
        type: 'about',
        title: 'About Me',
        content: {
          headline: `Professional ${category.charAt(0).toUpperCase() + category.slice(1)}`,
          bio: `I am a passionate ${category} with expertise in creating high-quality work that stands out.`,
          image: 'https://via.placeholder.com/400x400?text=Profile'
        },
        order: 0,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'projects',
        title: 'My Work',
        content: {
          projects: [
            {
              title: 'Project 1',
              description: `A sample ${category} project showcasing my skills and expertise.`,
              technologies: ['Skill 1', 'Skill 2', 'Skill 3'],
              image: 'https://via.placeholder.com/600x400?text=Project+1'
            },
            {
              title: 'Project 2',
              description: `Another ${category} project demonstrating my versatility and creativity.`,
              technologies: ['Skill 2', 'Skill 4', 'Skill 5'],
              image: 'https://via.placeholder.com/600x400?text=Project+2'
            }
          ]
        },
        order: 1,
        layout: 'two-columns'
      },
      {
        id: generateId(),
        type: 'skills',
        title: 'My Skills',
        content: {
          skills: [
            { name: 'Skill 1', level: 90 },
            { name: 'Skill 2', level: 85 },
            { name: 'Skill 3', level: 80 },
            { name: 'Skill 4', level: 75 }
          ]
        },
        order: 2,
        layout: 'full'
      },
      {
        id: generateId(),
        type: 'contact',
        title: 'Contact Me',
        content: {
          email: `${category}@example.com`,
          phone: '+1 (123) 456-7890',
          location: 'New York, NY',
          showContactForm: true
        },
        order: 3,
        layout: 'full'
      }
    ],
    theme: {
      mode: index % 2 === 0 ? 'light' : 'dark',
      primaryColor: getColorForCategory(category),
      secondaryColor: getSecondaryColorForCategory(category),
      fontFamily: getFontForCategory(category),
      fontSize: '16px'
    },
    isFeatured: index < 5, // First 5 are featured
    isPublic: true
  };
});

// Helper function to get a color for each category
function getColorForCategory(category: string): string {
  const colorMap: Record<string, string> = {
    developer: '#4f46e5', // Indigo
    designer: '#ec4899', // Pink
    photographer: '#8b5cf6', // Purple
    writer: '#10b981', // Green
    artist: '#f59e0b', // Amber
    business: '#0ea5e9', // Sky
    educator: '#14b8a6', // Teal
    healthcare: '#06b6d4', // Cyan
    fitness: '#ef4444', // Red
    culinary: '#f97316'  // Orange
  };
  
  return colorMap[category] || '#4f46e5';
}

// Helper function to get a secondary color for each category
function getSecondaryColorForCategory(category: string): string {
  const colorMap: Record<string, string> = {
    developer: '#c7d2fe', // Light Indigo
    designer: '#fbcfe8', // Light Pink
    photographer: '#ddd6fe', // Light Purple
    writer: '#a7f3d0', // Light Green
    artist: '#fef3c7', // Light Amber
    business: '#bae6fd', // Light Sky
    educator: '#99f6e4', // Light Teal
    healthcare: '#a5f3fc', // Light Cyan
    fitness: '#fecaca', // Light Red
    culinary: '#fed7aa'  // Light Orange
  };
  
  return colorMap[category] || '#c7d2fe';
}

// Helper function to get a font for each category
function getFontForCategory(category: string): string {
  const fontMap: Record<string, string> = {
    developer: 'Inter, sans-serif',
    designer: 'Montserrat, sans-serif',
    photographer: 'Playfair Display, serif',
    writer: 'Merriweather, serif',
    artist: 'Raleway, sans-serif',
    business: 'Roboto, sans-serif',
    educator: 'Poppins, sans-serif',
    healthcare: 'Nunito, sans-serif',
    fitness: 'Oswald, sans-serif',
    culinary: 'Lora, serif'
  };
  
  return fontMap[category] || 'Inter, sans-serif';
}

// Export the templates
export const categoryTemplates = templates;

// If this script is run directly, log the templates
// For ES modules, we check if the import.meta.url is the same as the file being executed
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(templates, null, 2));
  console.log(`Created ${templates.length} templates for categories: ${templateCategories.join(', ')}`);
}
 