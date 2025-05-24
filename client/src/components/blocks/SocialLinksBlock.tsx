import { Block } from "@shared/schema";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, Facebook, Youtube, Dribbble, Globe, Mail } from "lucide-react";

interface SocialLinksBlockProps {
  data: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: Block) => void;
}

export default function SocialLinksBlock({ data, isSelected, onSelect }: SocialLinksBlockProps) {
  const content = data.content;
  const styles = data.styles || {};
  
  // Default social links if none provided
  const socialLinks = content.links || [
    { platform: "github", url: "#", label: "GitHub" },
    { platform: "linkedin", url: "#", label: "LinkedIn" },
    { platform: "twitter", url: "#", label: "Twitter" },
    { platform: "instagram", url: "#", label: "Instagram" },
  ];
  
  // Function to render the appropriate icon based on platform
  const renderIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "dribbble":
        return <Dribbble className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };
  
  // Display mode: "grid" or "row"
  const displayMode = content.displayMode || "row";
  const displayClass = displayMode === "grid" ? "grid grid-cols-2 sm:grid-cols-4 gap-3" : "flex flex-wrap gap-3";
  
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
      
      {content.title && (
        <h2 className="text-xl font-semibold mb-4">{content.title}</h2>
      )}
      
      <div className={displayClass}>
        {socialLinks.map((link, index) => (
          <a 
            key={index} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={
              displayMode === "grid" 
                ? "flex items-center justify-center p-3 border border-gray-200 rounded-md hover:border-primary hover:bg-primary/5 transition-all" 
                : "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
            }
          >
            <div className={displayMode === "grid" ? "flex flex-col items-center" : ""}>
              <div className={displayMode === "grid" ? "mb-2" : ""}>
                {renderIcon(link.platform)}
              </div>
              {displayMode === "grid" && (
                <span className="text-xs">{link.label}</span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
