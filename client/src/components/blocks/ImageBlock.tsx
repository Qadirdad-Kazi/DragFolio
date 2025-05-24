import { Block } from "@shared/schema";
import { motion } from "framer-motion";

interface ImageBlockProps {
  data: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: Block) => void;
}

export default function ImageBlock({ data, isSelected, onSelect }: ImageBlockProps) {
  const content = data.content;
  
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
      
      <div className="w-full overflow-hidden rounded-lg">
        {content.imageUrl ? (
          <img 
            src={content.imageUrl as string} 
            alt={content.altText as string || "Image"} 
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
      </div>
      
      {content.caption && (
        <p className="mt-2 text-sm text-gray-600 text-center">
          {content.caption}
        </p>
      )}
    </div>
  );
}
