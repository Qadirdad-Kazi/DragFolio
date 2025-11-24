import { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, ExternalLink, Github, Check, ArrowUp, ArrowDown } from 'lucide-react';
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
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function ProjectsSection({
  section,
  isSelected,
  onSelect,
  updateSection,
  onMoveUp,
  onMoveDown
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
            onClick={addProject}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Add Project"
          >
            <Plus size={18} className="text-blue-600" />
          </Button>
        </div>
      )}

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
                className={`border rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${editingProject?.id === project.id ? 'ring-2 ring-primary shadow-lg' : 'shadow-sm border-gray-200 dark:border-gray-700'
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
                        value={project.title || ''}
                        onChange={(e) => updateProject({ ...project, title: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`project-description-${project.id}`}>Description</Label>
                      <Textarea
                        id={`project-description-${project.id}`}
                        value={project.description || ''}
                        onChange={(e) => updateProject({ ...project, description: e.target.value })}
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`project-technologies-${project.id}`}>Technologies</Label>
                      <Input
                        id={`project-technologies-${project.id}`}
                        value={(project.technologies || []).join(', ')}
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
                      <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 relative overflow-hidden group">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Project+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">{project.description}</p>

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={`${project.id}-tech-${index}`}
                                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-100 dark:border-blue-800"
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
                            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                          >
                            <Github size={16} className="mr-1.5" />
                            GitHub
                          </a>
                        )}

                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                          >
                            <ExternalLink size={16} className="mr-1.5" />
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
