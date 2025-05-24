import { Block } from "@shared/schema";
import { motion } from "framer-motion";
import { CalendarIcon, MapPin, Briefcase } from "lucide-react";

interface ExperienceBlockProps {
  data: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: Block) => void;
}

export default function ExperienceBlock({ data, isSelected, onSelect }: ExperienceBlockProps) {
  const content = data.content;
  
  // Default experience items if none provided
  const experienceItems = content.items || [
    {
      title: "Senior Developer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description: "Lead developer for client projects, mentoring junior developers, and implementing best practices across the organization."
    },
    {
      title: "Full-Stack Developer",
      company: "WebApp Innovations",
      location: "New York, NY",
      startDate: "Apr 2018",
      endDate: "Dec 2020",
      description: "Developed and maintained web applications for clients in various industries using React, Node.js, and PostgreSQL."
    }
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
      
      <h2 className="text-xl font-semibold mb-4">{content.title || "Work Experience"}</h2>
      
      <div className="space-y-6">
        {experienceItems.map((item, index) => (
          <div key={index} className="relative pl-8 border-l-2 border-gray-200 pb-6 last:pb-0">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
            
            <div>
              <h3 className="font-medium text-lg">{item.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                <span>{item.company}</span>
              </div>
              
              <div className="flex items-start flex-wrap gap-x-4 text-sm text-gray-600 mb-2">
                {(item.startDate || item.endDate) && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{item.startDate} - {item.endDate}</span>
                  </div>
                )}
                
                {item.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
