import { Block } from "@shared/schema";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactBlockProps {
  data: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: Block) => void;
}

export default function ContactBlock({ data, isSelected, onSelect }: ContactBlockProps) {
  const content = data.content;
  const styles = data.styles || {};
  
  // Layout direction
  const layoutClass = styles.layout === "column" ? "flex-col" : "flex-col md:flex-row";
  
  return (
    <div 
      className="p-6 relative"
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
      
      <h2 className="text-xl font-semibold mb-4">{content.title || "Get In Touch"}</h2>
      
      <div className={`flex gap-6 ${layoutClass}`}>
        <div className="flex-1 space-y-4">
          <p className="text-gray-700">
            {content.message || "I'm always interested in new opportunities and collaborations. Feel free to reach out if you'd like to work together!"}
          </p>
          
          <div className="flex items-center">
            <Mail className="text-gray-500 mr-3 h-5 w-5" />
            <span>{content.email || "your.email@example.com"}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="text-gray-500 mr-3 h-5 w-5" />
            <span>{content.location || "Your Location"}</span>
          </div>
          
          <div className="flex space-x-3">
            <a href={content.linkedin || "#"} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
              <Linkedin className="h-4 w-4 text-gray-700" />
            </a>
            <a href={content.github || "#"} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
              <Github className="h-4 w-4 text-gray-700" />
            </a>
            <a href={content.twitter || "#"} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
              <Twitter className="h-4 w-4 text-gray-700" />
            </a>
          </div>
        </div>
        
        <div className="flex-1">
          <form className="space-y-3">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Name</Label>
              <Input className="w-full" placeholder="Your name" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
              <Input type="email" className="w-full" placeholder="Your email" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Message</Label>
              <Textarea className="w-full" rows={3} placeholder="Your message" />
            </div>
            <Button type="button" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
