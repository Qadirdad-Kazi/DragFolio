import { Block } from "@shared/schema";
import { motion } from "framer-motion";

interface SkillsBlockProps {
  data: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: Block) => void;
}

export default function SkillsBlock({ data, isSelected, onSelect }: SkillsBlockProps) {
  const content = data.content;
  
  const skills = content.skills || [
    { name: "JavaScript", level: 90 },
    { name: "React", level: 85 },
    { name: "Node.js", level: 75 },
    { name: "UI/UX Design", level: 80 },
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
      
      <h2 className="text-xl font-semibold mb-4">{content.title || "Skills"}</h2>
      
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{skill.name}</span>
              <span className="text-sm text-gray-500">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
