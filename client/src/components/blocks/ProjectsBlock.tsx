import { Block } from "@shared/schema";
import { motion } from "framer-motion";

interface ProjectsBlockProps {
  data: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: Block) => void;
}

export default function ProjectsBlock({ data, isSelected, onSelect }: ProjectsBlockProps) {
  const content = data.content;
  
  const projects = content.projects || [
    {
      title: "E-commerce Dashboard",
      description: "A complete admin panel for online stores with analytics and inventory management.",
      image: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=338&q=80",
      tags: ["React", "Firebase"],
    },
    {
      title: "Fitness Tracker App",
      description: "Mobile application for tracking workouts and nutrition with social features.",
      image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=338&q=80",
      tags: ["React Native", "GraphQL"],
    },
  ];
  
  return (
    <div 
      className="p-6 border-b border-gray-200 relative"
      onClick={onSelect}
    >
      {/* Highlight overlay when selected */}
      {isSelected && (
        <motion.div 
          className="absolute inset-0 ring-2 ring-blue-400 bg-blue-50/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      <h2 className="text-xl font-semibold mb-4">{content.title || "Projects"}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-100">
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{project.description}</p>
              <div className="flex gap-2">
                {project.tags && project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
