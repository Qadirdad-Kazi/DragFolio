import { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, Briefcase, GraduationCap, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ResumeSectionProps {
  section: PortfolioSection;
  isSelected: boolean;
  onSelect: () => void;
  updateSection: (updates: Partial<PortfolioSection>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function ResumeSection({
  section,
  isSelected,
  onSelect,
  updateSection,
  onMoveUp,
  onMoveDown
}: ResumeSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('experience');
  const content = section.content || { experience: [], education: [] };
  const experience: Experience[] = content.experience || [];
  const education: Education[] = content.education || [];

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Add a new experience
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: 'Job Title',
      company: 'Company Name',
      location: 'Location',
      startDate: '',
      endDate: '',
      current: false,
      description: 'Describe your responsibilities and achievements'
    };

    updateSection({
      content: {
        ...content,
        experience: [...experience, newExperience]
      }
    });
  };

  // Update an experience
  const updateExperience = (updatedExperience: Experience) => {
    updateSection({
      content: {
        ...content,
        experience: experience.map(exp =>
          exp.id === updatedExperience.id ? updatedExperience : exp
        )
      }
    });
  };

  // Remove an experience
  const removeExperience = (experienceId: string) => {
    updateSection({
      content: {
        ...content,
        experience: experience.filter(exp => exp.id !== experienceId)
      }
    });
  };

  // Add a new education
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: 'Degree',
      institution: 'Institution Name',
      location: 'Location',
      startDate: '',
      endDate: '',
      current: false,
      description: 'Describe your studies and achievements'
    };

    updateSection({
      content: {
        ...content,
        education: [...education, newEducation]
      }
    });
  };

  // Update an education
  const updateEducation = (updatedEducation: Education) => {
    updateSection({
      content: {
        ...content,
        education: education.map(edu =>
          edu.id === updatedEducation.id ? updatedEducation : edu
        )
      }
    });
  };

  // Remove an education
  const removeEducation = (educationId: string) => {
    updateSection({
      content: {
        ...content,
        education: education.filter(edu => edu.id !== educationId)
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

          {activeTab === 'experience' ? (
            <Button
              variant="secondary"
              size="icon"
              onClick={addExperience}
              className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Add Experience"
            >
              <Plus size={18} className="text-blue-600" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="icon"
              onClick={addEducation}
              className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Add Education"
            >
              <Plus size={18} className="text-blue-600" />
            </Button>
          )}
        </div>
      )}

      <CardContent>
        <Tabs defaultValue="experience" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="experience">
              <Briefcase size={16} className="mr-2" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="education">
              <GraduationCap size={16} className="mr-2" />
              Education
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience">
            {experience.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No work experience added yet</p>
                {isSelected && (
                  <Button variant="outline" onClick={addExperience}>
                    <Plus size={16} className="mr-2" />
                    Add Your First Experience
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {experience.map(exp => (
                  <div
                    key={exp.id}
                    className="border-l-4 border-primary pl-4 py-1"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <Label htmlFor={`exp-title-${exp.id}`}>Job Title</Label>
                            <Input
                              id={`exp-title-${exp.id}`}
                              value={exp.title || ''}
                              onChange={(e) => updateExperience({ ...exp, title: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExperience(exp.id)}
                            className="mt-6"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </div>

                        <div>
                          <Label htmlFor={`exp-company-${exp.id}`}>Company</Label>
                          <Input
                            id={`exp-company-${exp.id}`}
                            value={exp.company || ''}
                            onChange={(e) => updateExperience({ ...exp, company: e.target.value })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`exp-location-${exp.id}`}>Location</Label>
                          <Input
                            id={`exp-location-${exp.id}`}
                            value={exp.location || ''}
                            onChange={(e) => updateExperience({ ...exp, location: e.target.value })}
                            className="mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`exp-start-${exp.id}`}>Start Date</Label>
                            <Input
                              id={`exp-start-${exp.id}`}
                              value={exp.startDate || ''}
                              onChange={(e) => updateExperience({ ...exp, startDate: e.target.value })}
                              placeholder="MM/YYYY"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`exp-end-${exp.id}`}>End Date</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Input
                                id={`exp-end-${exp.id}`}
                                value={exp.endDate || ''}
                                onChange={(e) => updateExperience({ ...exp, endDate: e.target.value })}
                                placeholder="MM/YYYY"
                                disabled={exp.current}
                              />
                              <div className="flex items-center space-x-1">
                                <input
                                  type="checkbox"
                                  id={`exp-current-${exp.id}`}
                                  checked={exp.current}
                                  onChange={(e) => updateExperience({
                                    ...exp,
                                    current: e.target.checked,
                                    endDate: e.target.checked ? 'Present' : exp.endDate
                                  })}
                                />
                                <Label htmlFor={`exp-current-${exp.id}`} className="text-sm">Current</Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`exp-description-${exp.id}`}>Description</Label>
                          <Textarea
                            id={`exp-description-${exp.id}`}
                            value={exp.description || ''}
                            onChange={(e) => updateExperience({ ...exp, description: e.target.value })}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-lg font-medium">{exp.title}</h4>
                        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2">
                          <span className="font-medium">{exp.company}</span>
                          {exp.location && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          {exp.startDate && exp.endDate && (
                            <>
                              {exp.startDate} - {exp.endDate}
                            </>
                          )}
                        </div>
                        <p className="text-gray-600 whitespace-pre-line">{exp.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="education">
            {education.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No education added yet</p>
                {isSelected && (
                  <Button variant="outline" onClick={addEducation}>
                    <Plus size={16} className="mr-2" />
                    Add Your First Education
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {education.map(edu => (
                  <div
                    key={edu.id}
                    className="border-l-4 border-primary pl-4 py-1"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <Label htmlFor={`edu-degree-${edu.id}`}>Degree</Label>
                            <Input
                              id={`edu-degree-${edu.id}`}
                              value={edu.degree || ''}
                              onChange={(e) => updateEducation({ ...edu, degree: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEducation(edu.id)}
                            className="mt-6"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </div>

                        <div>
                          <Label htmlFor={`edu-institution-${edu.id}`}>Institution</Label>
                          <Input
                            id={`edu-institution-${edu.id}`}
                            value={edu.institution || ''}
                            onChange={(e) => updateEducation({ ...edu, institution: e.target.value })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`edu-location-${edu.id}`}>Location</Label>
                          <Input
                            id={`edu-location-${edu.id}`}
                            value={edu.location || ''}
                            onChange={(e) => updateEducation({ ...edu, location: e.target.value })}
                            className="mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`edu-start-${edu.id}`}>Start Date</Label>
                            <Input
                              id={`edu-start-${edu.id}`}
                              value={edu.startDate || ''}
                              onChange={(e) => updateEducation({ ...edu, startDate: e.target.value })}
                              placeholder="MM/YYYY"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`edu-end-${edu.id}`}>End Date</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Input
                                id={`edu-end-${edu.id}`}
                                value={edu.endDate || ''}
                                onChange={(e) => updateEducation({ ...edu, endDate: e.target.value })}
                                placeholder="MM/YYYY"
                                disabled={edu.current}
                              />
                              <div className="flex items-center space-x-1">
                                <input
                                  type="checkbox"
                                  id={`edu-current-${edu.id}`}
                                  checked={edu.current}
                                  onChange={(e) => updateEducation({
                                    ...edu,
                                    current: e.target.checked,
                                    endDate: e.target.checked ? 'Present' : edu.endDate
                                  })}
                                />
                                <Label htmlFor={`edu-current-${edu.id}`} className="text-sm">Current</Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`edu-description-${edu.id}`}>Description</Label>
                          <Textarea
                            id={`edu-description-${edu.id}`}
                            value={edu.description || ''}
                            onChange={(e) => updateEducation({ ...edu, description: e.target.value })}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-lg font-medium">{edu.degree}</h4>
                        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2">
                          <span className="font-medium">{edu.institution}</span>
                          {edu.location && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{edu.location}</span>
                            </>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          {edu.startDate && edu.endDate && (
                            <>
                              {edu.startDate} - {edu.endDate}
                            </>
                          )}
                        </div>
                        <p className="text-gray-600 whitespace-pre-line">{edu.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
