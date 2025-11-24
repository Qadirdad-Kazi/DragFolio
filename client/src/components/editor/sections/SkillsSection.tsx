import React, { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, LayoutGrid, List, Check, ArrowUp, ArrowDown } from 'lucide-react';
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
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function SkillsSection({
  section,
  isSelected,
  onSelect,
  updateSection,
  onMoveUp,
  onMoveDown
}: SkillsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const content = section.content || { skills: [], viewMode: 'bars' }; // 'bars' or 'tags'
  const skills: Skill[] = content.skills || [];
  const viewMode = content.viewMode || 'bars';

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

  // Toggle view mode
  const toggleViewMode = () => {
    updateSection({
      content: {
        ...content,
        viewMode: viewMode === 'bars' ? 'tags' : 'bars'
      }
    });
  };

  return (
    <Card
      className={`portfolio-section ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      <div className="portfolio-section-header p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{section.title}</h3>
      </div>

      {isSelected && (
        <div className="absolute top-4 -right-16 flex flex-col gap-2 z-10">
          <Button
            variant="secondary"
            size="icon"
            onClick={onMoveUp}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Move Up"
          >
            <ArrowUp size={18} className="text-gray-600 dark:text-gray-300" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={onMoveDown}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Move Down"
          >
            <ArrowDown size={18} className="text-gray-600 dark:text-gray-300" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={toggleEditing}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={isEditing ? "Finish Editing" : "Edit Section"}
          >
            {isEditing ? <Check size={18} className="text-green-600" /> : <Edit size={18} className="text-gray-600 dark:text-gray-300" />}
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={addSkill}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Add Skill"
          >
            <Plus size={18} className="text-blue-600" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={toggleViewMode}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={viewMode === 'bars' ? "Switch to Tags View" : "Switch to Bars View"}
          >
            {viewMode === 'bars' ? <LayoutGrid size={18} className="text-purple-600" /> : <List size={18} className="text-purple-600" />}
          </Button>
        </div>
      )}

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
            {viewMode === 'tags' && !isEditing ? (
              <div className="col-span-full flex flex-wrap gap-3">
                {skills.map(skill => (
                  <div
                    key={skill.id}
                    className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-2 hover:shadow-md transition-shadow"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                    {skill.level >= 90 && <span className="text-xs text-yellow-500">★</span>}
                  </div>
                ))}
              </div>
            ) : (
              skills.map(skill => (
                <div
                  key={skill.id}
                  className="mb-4"
                >
                  {isEditing ? (
                    <div className="space-y-2 p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-900/50">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`skill-name-${skill.id}`}>Skill Name</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(skill.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <Input
                        id={`skill-name-${skill.id}`}
                        value={skill.name || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSkill({ ...skill, name: e.target.value })}
                        className="bg-white dark:bg-gray-800"
                      />

                      <div className="mt-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`skill-level-${skill.id}`} className="text-xs text-gray-500">Proficiency: {skill.level}%</Label>
                        </div>
                        <Slider
                          id={`skill-level-${skill.id}`}
                          value={[skill.level || 0]}
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
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-200">{skill.name}</span>
                        <span className="text-sm text-gray-500 font-medium">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
