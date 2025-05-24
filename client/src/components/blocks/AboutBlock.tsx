import { Block } from "@shared/schema";
import { motion } from "framer-motion";

interface AboutBlockProps {
  data: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: Block) => void;
}

export default function AboutBlock({ data, isSelected, onSelect }: AboutBlockProps) {
  const content = data.content;
  const styles = data.styles || {};
  
  // Layout direction
  const layoutClass = styles.layout === "column" ? "flex-col" : "flex-col md:flex-row";
  
  return (
    <div 
      className={`p-6 border-b border-gray-200 relative`}
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
      
      <h2 className="text-xl font-semibold mb-3">{content.title || "About Me"}</h2>
      <div className={`flex gap-6 ${layoutClass}`}>
        <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0 self-center md:self-start overflow-hidden">
          {content.imageUrl ? (
            <img 
              src={content.imageUrl as string} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-700 mb-4">{content.bio || "Add your bio here. Tell visitors about yourself, your skills, and your experience."}</p>
          
          {content.skills && Array.isArray(content.skills) && content.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">JavaScript</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Node.js</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">UI/UX</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
