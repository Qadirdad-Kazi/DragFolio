import { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, ExternalLink, Github } from 'lucide-react';
// Dialog components removed as they're not used in this file
import { Label } from '@/components/ui/label';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
}

interface ProjectsSectionProps {
  section: PortfolioSection;
  isSelected: boolean;
  onSelect: () => void;
  updateSection: (updates: Partial<PortfolioSection>) => void;
}

export default function ProjectsSection({
  section,
  isSelected,
  onSelect,
  updateSection
}: ProjectsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const content = section.content || { projects: [] };
  const projects: Project[] = content.projects || [];

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setEditingProject(null);
  };

  // Add a new project
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Project description',
      technologies: [],
      githubUrl: '',
      demoUrl: '',
      image: ''
    };
    
    updateSection({
      content: {
        ...content,
        projects: [...projects, newProject]
      }
    });
    
    setEditingProject(newProject);
  };

  // Update a project
  const updateProject = (updatedProject: Project) => {
    updateSection({
      content: {
        ...content,
        projects: projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        )
      }
    });
  };

  // Remove a project
  const removeProject = (projectId: string) => {
    updateSection({
      content: {
        ...content,
        projects: projects.filter(p => p.id !== projectId)
      }
    });
    
    if (editingProject?.id === projectId) {
      setEditingProject(null);
    }
  };

  // Handle technology input
  const handleTechnologiesChange = (technologies: string, projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const techArray = technologies.split(',').map(tech => tech.trim()).filter(Boolean);
      updateProject({
        ...project,
        technologies: techArray
      });
    }
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
            <Button variant="ghost" size="sm" onClick={addProject}>
              <Plus size={16} className="mr-2" />
              Add Project
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleEditing}>
              <Edit size={16} className="mr-2" />
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </div>
        )}
      </div>
      
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No projects added yet</p>
            {isSelected && (
              <Button variant="outline" onClick={addProject}>
                <Plus size={16} className="mr-2" />
                Add Your First Project
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid ${section.layout === 'two-columns' ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {projects.map(project => (
              <div 
                key={project.id} 
                className={`border rounded-lg overflow-hidden ${
                  editingProject?.id === project.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                {isEditing ? (
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Edit Project</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeProject(project.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                    
                    <div>
                      <Label htmlFor={`project-title-${project.id}`}>Title</Label>
                      <Input
                        id={`project-title-${project.id}`}
                        value={project.title}
                        onChange={(e) => updateProject({ ...project, title: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`project-description-${project.id}`}>Description</Label>
                      <Textarea
                        id={`project-description-${project.id}`}
                        value={project.description}
                        onChange={(e) => updateProject({ ...project, description: e.target.value })}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`project-technologies-${project.id}`}>Technologies</Label>
                      <Input
                        id={`project-technologies-${project.id}`}
                        value={project.technologies.join(', ')}
                        onChange={(e) => handleTechnologiesChange(e.target.value, project.id)}
                        placeholder="React, Node.js, MongoDB, etc."
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Comma-separated list of technologies</p>
                    </div>
                    
                    <div>
                      <Label htmlFor={`project-github-${project.id}`}>GitHub URL</Label>
                      <Input
                        id={`project-github-${project.id}`}
                        value={project.githubUrl || ''}
                        onChange={(e) => updateProject({ ...project, githubUrl: e.target.value })}
                        placeholder="https://github.com/username/repo"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`project-demo-${project.id}`}>Demo URL</Label>
                      <Input
                        id={`project-demo-${project.id}`}
                        value={project.demoUrl || ''}
                        onChange={(e) => updateProject({ ...project, demoUrl: e.target.value })}
                        placeholder="https://example.com"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`project-image-${project.id}`}>Image URL</Label>
                      <Input
                        id={`project-image-${project.id}`}
                        value={project.image || ''}
                        onChange={(e) => updateProject({ ...project, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {project.image && (
                      <div className="aspect-video w-full bg-gray-100">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Project+Image';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="text-lg font-medium mb-2">{project.title}</h4>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={`${project.id}-tech-${index}`}
                                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
                          >
                            <Github size={16} className="mr-1" />
                            GitHub
                          </a>
                        )}
                        
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
                          >
                            <ExternalLink size={16} className="mr-1" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
