import { Block } from "@shared/schema";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeBlockProps {
  data: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: Block) => void;
}

export default function ResumeBlock({ data, isSelected, onSelect }: ResumeBlockProps) {
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
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="mr-4 p-3 bg-primary/10 text-primary rounded-lg">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{content.title || "My Resume"}</h2>
            <p className="text-gray-600 text-sm">
              {content.description || "Download my full resume to learn more about my experience and skills."}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {content.downloadUrl && (
            <Button className="flex items-center">
              <Download className="mr-1.5 h-4 w-4" />
              Download Resume
            </Button>
          )}
          
          {content.viewUrl && (
            <Button variant="outline" className="flex items-center">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              View Resume
            </Button>
          )}
        </div>
      </div>
      
      {/* Preview section if there's a preview image */}
      {content.previewImageUrl && (
        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
          <img 
            src={content.previewImageUrl as string} 
            alt="Resume preview" 
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}
