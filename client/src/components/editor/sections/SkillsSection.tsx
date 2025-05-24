import React, { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface SkillsSectionProps {
  section: PortfolioSection;
  isSelected: boolean;
  onSelect: () => void;
  updateSection: (updates: Partial<PortfolioSection>) => void;
}

export default function SkillsSection({
  section,
  isSelected,
  onSelect,
  updateSection
}: SkillsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const content = section.content || { skills: [] };
  const skills: Skill[] = content.skills || [];

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Add a new skill
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: 'New Skill',
      level: 70
    };
    
    updateSection({
      content: {
        ...content,
        skills: [...skills, newSkill]
      }
    });
  };

  // Update a skill
  const updateSkill = (updatedSkill: Skill) => {
    updateSection({
      content: {
        ...content,
        skills: skills.map(s => 
          s.id === updatedSkill.id ? updatedSkill : s
        )
      }
    });
  };

  // Remove a skill
  const removeSkill = (skillId: string) => {
    updateSection({
      content: {
        ...content,
        skills: skills.filter(s => s.id !== skillId)
      }
    });
  };

  return (
    <Card
      className={`portfolio-section ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      <div className="portfolio-section-header">
        <h3 className="text-xl font-semibold">{section.title}</h3>
        {isSelected && (
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={addSkill}>
              <Plus size={16} className="mr-2" />
              Add Skill
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleEditing}>
              <Edit size={16} className="mr-2" />
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </div>
        )}
      </div>
      
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No skills added yet</p>
            {isSelected && (
              <Button variant="outline" onClick={addSkill}>
                <Plus size={16} className="mr-2" />
                Add Your First Skill
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid ${section.layout === 'two-columns' ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {skills.map(skill => (
              <div 
                key={skill.id} 
                className="mb-4"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`skill-name-${skill.id}`}>Skill Name</Label>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeSkill(skill.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                    <Input
                      id={`skill-name-${skill.id}`}
                      value={skill.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSkill({ ...skill, name: e.target.value })}
                    />
                    
                    <div className="mt-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`skill-level-${skill.id}`}>Skill Level: {skill.level}%</Label>
                      </div>
                      <Slider
                        id={`skill-level-${skill.id}`}
                        value={[skill.level]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value: number[]) => updateSkill({ ...skill, level: value[0] })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
