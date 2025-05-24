import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/editor/ImageUploader';

// Template interface
interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  sections: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data for templates
const MOCK_TEMPLATES: Template[] = [
  {
    id: 'template-1',
    name: 'Developer Portfolio',
    category: 'developer',
    description: 'A clean and modern template for developers to showcase their projects and skills.',
    thumbnail: 'https://via.placeholder.com/600x400?text=Developer+Template',
    sections: ['about', 'skills', 'projects', 'resume', 'contact'],
    isPublished: true,
    createdAt: '2025-04-15T10:30:00Z',
    updatedAt: '2025-05-20T10:30:00Z'
  },
  {
    id: 'template-2',
    name: 'Designer Showcase',
    category: 'designer',
    description: 'A visually stunning template for designers to display their creative work.',
    thumbnail: 'https://via.placeholder.com/600x400?text=Designer+Template',
    sections: ['about', 'projects', 'testimonials', 'contact'],
    isPublished: true,
    createdAt: '2025-04-20T14:45:00Z',
    updatedAt: '2025-05-15T14:45:00Z'
  },
  {
    id: 'template-3',
    name: 'Freelancer Portfolio',
    category: 'freelancer',
    description: 'Perfect for freelancers who want to highlight their services and previous work.',
    thumbnail: 'https://via.placeholder.com/600x400?text=Freelancer+Template',
    sections: ['about', 'services', 'projects', 'testimonials', 'contact'],
    isPublished: true,
    createdAt: '2025-04-25T09:15:00Z',
    updatedAt: '2025-05-10T09:15:00Z'
  },
  {
    id: 'template-4',
    name: 'Minimal Resume',
    category: 'professional',
    description: 'A minimalist template focused on professional experience and skills.',
    thumbnail: 'https://via.placeholder.com/600x400?text=Resume+Template',
    sections: ['about', 'skills', 'resume', 'contact'],
    isPublished: false,
    createdAt: '2025-05-01T11:30:00Z',
    updatedAt: '2025-05-05T11:30:00Z'
  }
];

// Categories for filtering
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'photographer', label: 'Photographer' }
];

// Available sections
const AVAILABLE_SECTIONS = [
  { value: 'about', label: 'About Me' },
  { value: 'skills', label: 'Skills' },
  { value: 'projects', label: 'Projects' },
  { value: 'resume', label: 'Resume' },
  { value: 'services', label: 'Services' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'blog', label: 'Blog' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'contact', label: 'Contact' }
];

export default function AdminTemplates() {
  const { isAuthenticated, user } = useAuth();
  const [_, navigate] = useLocation();
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'developer',
    description: '',
    thumbnail: '',
    sections: ['about', 'projects', 'contact'],
    isPublished: false
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  // Filter templates based on active tab and search query
  const filteredTemplates = templates.filter(template => {
    // Filter by tab
    if (activeTab === 'published' && !template.isPublished) return false;
    if (activeTab === 'drafts' && template.isPublished) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle sections change
  const handleSectionToggle = (section: string) => {
    setFormData(prev => {
      const sections = [...prev.sections];
      if (sections.includes(section)) {
        return { ...prev, sections: sections.filter(s => s !== section) };
      } else {
        return { ...prev, sections: [...sections, section] };
      }
    });
  };

  // Handle image upload
  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, thumbnail: imageUrl }));
  };

  // Open create dialog
  const openCreateDialog = () => {
    setFormData({
      name: '',
      category: 'developer',
      description: '',
      thumbnail: '',
      sections: ['about', 'projects', 'contact'],
      isPublished: false
    });
    setIsCreateDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (template: Template) => {
    setTemplateToEdit(template);
    setFormData({
      name: template.name,
      category: template.category,
      description: template.description,
      thumbnail: template.thumbnail,
      sections: template.sections,
      isPublished: template.isPublished
    });
    setIsEditDialogOpen(true);
  };

  // Handle create template
  const handleCreateTemplate = () => {
    if (!formData.name.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        thumbnail: formData.thumbnail || `https://via.placeholder.com/600x400?text=${encodeURIComponent(formData.name)}`,
        sections: formData.sections,
        isPublished: formData.isPublished,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTemplates([newTemplate, ...templates]);
      setIsCreateDialogOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  // Handle update template
  const handleUpdateTemplate = () => {
    if (!templateToEdit || !formData.name.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedTemplates = templates.map(template => {
        if (template.id === templateToEdit.id) {
          return {
            ...template,
            name: formData.name,
            category: formData.category,
            description: formData.description,
            thumbnail: formData.thumbnail || template.thumbnail,
            sections: formData.sections,
            isPublished: formData.isPublished,
            updatedAt: new Date().toISOString()
          };
        }
        return template;
      });
      
      setTemplates(updatedTemplates);
      setIsEditDialogOpen(false);
      setTemplateToEdit(null);
      setIsLoading(false);
    }, 1000);
  };

  // Handle delete template
  const handleDeleteTemplate = () => {
    if (!templateToDelete) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTemplates(templates.filter(template => template.id !== templateToDelete.id));
      setIsDeleteDialogOpen(false);
      setTemplateToDelete(null);
      setIsLoading(false);
    }, 1000);
  };

  // Template form component
  const TemplateForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Developer Portfolio"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.filter(c => c.value !== 'all').map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe this template..."
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Template Thumbnail</Label>
        <ImageUploader
          currentImage={formData.thumbnail}
          onImageUpload={handleImageUpload}
          label=""
        />
      </div>
      
      <div className="space-y-2">
        <Label>Included Sections</Label>
        <div className="grid grid-cols-2 gap-4">
          {AVAILABLE_SECTIONS.map(section => (
            <div key={section.value} className="flex items-center space-x-2">
              <Switch 
                checked={formData.sections.includes(section.value)}
                onCheckedChange={() => handleSectionToggle(section.value)}
                id={`section-${section.value}`}
              />
              <Label htmlFor={`section-${section.value}`}>{section.label}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          checked={formData.isPublished}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
          id="publish-status"
        />
        <Label htmlFor="publish-status">Publish Template</Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Template Management</h1>
            <p className="text-gray-500">Create and manage portfolio templates</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
            
            <Button onClick={openCreateDialog}>
              <Plus size={16} className="mr-2" />
              New Template
            </Button>
          </div>
        </div>
        
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No templates found</p>
              <Button onClick={openCreateDialog}>
                Create Your First Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full ${template.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {template.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.sections.map(section => (
                      <span 
                        key={section} 
                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Category: {template.category.charAt(0).toUpperCase() + template.category.slice(1)}</p>
                    <p>Last updated: {formatDate(template.updatedAt)}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openEditDialog(template)}
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/preview?template=${template.id}`)}
                    >
                      <Eye size={14} className="mr-1" />
                      Preview
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setTemplateToDelete(template);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new portfolio template for users to choose from.
            </DialogDescription>
          </DialogHeader>
          
          <TemplateForm />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTemplate} 
              disabled={!formData.name.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Template'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the template details and settings.
            </DialogDescription>
          </DialogHeader>
          
          <TemplateForm />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateTemplate} 
              disabled={!formData.name.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Template'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {templateToDelete && (
            <div className="py-4">
              <p className="font-medium">{templateToDelete.name}</p>
              <p className="text-sm text-gray-500">{templateToDelete.description}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTemplate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Template'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
