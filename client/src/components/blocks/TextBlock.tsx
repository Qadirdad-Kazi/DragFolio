import { Block } from "@shared/schema";
import { motion } from "framer-motion";

interface TextBlockProps {
  data: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: Block) => void;
}

export default function TextBlock({ data, isSelected, onSelect }: TextBlockProps) {
  const content = data.content;
  const styles = data.styles || {};
  
  // Default color handling
  const textColor = styles.textColor as string || "inherit";
  const backgroundColor = styles.backgroundColor as string || "transparent";
  
  return (
    <div 
      className="p-6 border-b border-gray-200 relative"
      onClick={onSelect}
      style={{ 
        backgroundColor,
        color: textColor
      }}
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
      
      {content.heading && (
        <h2 className="text-xl font-semibold mb-3">{content.heading}</h2>
      )}
      
      <div className="prose max-w-none">
        {content.text ? (
          <p>{content.text}</p>
        ) : (
          <p className="text-gray-500">Add your text here. This block is perfect for paragraphs, descriptions, or any textual content you want to include in your portfolio.</p>
        )}
      </div>
      
      {content.callToAction && (
        <div className="mt-4">
          <a 
            href={content.callToActionUrl as string || "#"} 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {content.callToAction}
          </a>
        </div>
      )}
    </div>
  );
}
