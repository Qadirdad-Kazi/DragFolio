import { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Box,
  Skeleton,
  Alert,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import TemplateCard from '../components/TemplateCard';
import { templateApi, portfolioApi } from '../services/api';
import { Template } from '../types';

// Extended Template interface with additional properties
// Using Omit to remove properties we want to redefine
interface EnhancedTemplate extends Omit<Template, 'popularity'> {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  popularity: number; // Making it required to match Template interface
}

// Categories for filtering
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'developer', label: 'Developer', color: '#2196F3' },
  { value: 'designer', label: 'Designer', color: '#9C27B0' },
  { value: 'student', label: 'Student', color: '#4CAF50' },
  { value: 'freelancer', label: 'Freelancer', color: '#FF9800' },
  { value: 'photographer', label: 'Photographer', color: '#E91E63' },
  { value: 'writer', label: 'Writer', color: '#3F51B5' },
  { value: 'artist', label: 'Artist', color: '#795548' },
  { value: 'musician', label: 'Musician', color: '#009688' },
  { value: 'teacher', label: 'Teacher', color: '#673AB7' },
  { value: 'entrepreneur', label: 'Entrepreneur', color: '#FF5722' }
];

// Sort options
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'nameAsc', label: 'Name (A-Z)' },
  { value: 'nameDesc', label: 'Name (Z-A)' }
];

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner', color: '#4CAF50' },
  { value: 'intermediate', label: 'Intermediate', color: '#FF9800' },
  { value: 'advanced', label: 'Advanced', color: '#F44336' }
];

export default function Templates() {
  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortOption, setSortOption] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // State for templates and loading
  const [templates, setTemplates] = useState<EnhancedTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State for template preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EnhancedTemplate | null>(null);
  
  // Create a mapping of category values to their colors for the TemplateCard
  const categoryColors = CATEGORIES.reduce((acc, category) => {
    if (category.value !== 'all' && category.color) {
      acc[category.value] = category.color;
    }
    return acc;
  }, {} as Record<string, string>);

  // Filter out custom templates for display
  const systemTemplates = templates.filter((template) => !template.isCustom);

  // Filter templates based on search, category, and difficulty
  const filteredTemplates = systemTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.tags && template.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Sort templates based on selected sort option
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortOption) {
      case 'popular':
        return b.popularity - a.popularity;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Fetch templates when component mounts
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  // Fetch templates from API
  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await templateApi.getAll();
      console.log('Templates received from API:', data);
      
      // Add mock data for new fields if they don't exist
      const enhancedData = data
        .filter((template: any) => template.isPublic)
        .map((template: any) => {
          // Assign random difficulty if not present
          if (!template.difficulty) {
            const difficulties = ['beginner', 'intermediate', 'advanced'];
            template.difficulty = difficulties[Math.floor(Math.random() * difficulties.length)] as 'beginner' | 'intermediate' | 'advanced';
          }
          
          // Assign random popularity if not present
          if (!template.popularity) {
            template.popularity = Math.floor(Math.random() * 500) + 50;
          } else {
            // Ensure popularity is a number, not undefined
            template.popularity = Number(template.popularity);
          }
          
          return template as EnhancedTemplate;
        });
      
      setTemplates(enhancedData);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError('Failed to load templates. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle template selection
  const selectTemplate = async (templateId: string) => {
    try {
      setLoadingTemplateId(templateId);
      setError(null);
      
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template with ID ${templateId} not found`);
      }
      
      // Validate template data
      if (!template.sections || template.sections.length === 0) {
        throw new Error('Template has no sections defined');
      }
      if (!template.theme) {
        throw new Error('Template has no theme defined');
      }
      
      // Create a new portfolio based on the selected template
      const portfolioData = {
        title: template.name,
        description: template.description,
        template: templateId,
        isPublished: false,
        userId: JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || '')).id || 'demo-user',
        sections: template.sections,
        theme: template.theme
      };
      
      try {
        // Create a new portfolio with the template data
        const newPortfolio = await portfolioApi.create(portfolioData);
        console.log('Created new portfolio:', newPortfolio);
        
        // Check for ID in the response - it could be in different formats
        // The API might return _id instead of id, or it might be nested
        const portfolioId = newPortfolio._id || newPortfolio.id || 
                          (newPortfolio._doc && (newPortfolio._doc._id || newPortfolio._doc.id));
        
        if (!portfolioId) {
          console.error('Portfolio created but no ID found in response:', newPortfolio);
          // Try to extract ID from the object if it exists
          const possibleId = Object.keys(newPortfolio).find(key => 
            key === '_id' || key === 'id' || 
            (typeof newPortfolio[key] === 'string' && newPortfolio[key].length > 20)
          );
          
          if (possibleId) {
            console.log('Found possible ID field:', possibleId, newPortfolio[possibleId]);
            const extractedId = newPortfolio[possibleId];
            
            // Store the template data in localStorage
            localStorage.setItem('selectedTemplateData', JSON.stringify({
              id: extractedId,
              sections: template.sections,
              theme: template.theme,
              name: template.name,
              description: template.description
            }));
            
            // Navigate to the editor with the extracted ID
            console.log('Navigating to editor with extracted ID:', extractedId);
            window.location.href = `/editor/${extractedId}`;
            return;
          }
          
          throw new Error('Failed to extract portfolio ID from response');
        }
        
        // Store the template data in localStorage to ensure it's available in the editor
        localStorage.setItem('selectedTemplateData', JSON.stringify({
          id: portfolioId,
          sections: template.sections,
          theme: template.theme,
          name: template.name,
          description: template.description
        }));
        
        // Navigate to the editor with the portfolio ID
        console.log('Navigating to editor with ID:', portfolioId);
        window.location.href = `/editor/${portfolioId}`;
      } catch (error) {
        console.error('Error creating portfolio:', error);
        setError('Failed to create portfolio. Please try again.');
        setLoadingTemplateId(null);
      }
      
    } catch (err: any) {
      console.error('Failed to select template:', err);
      setError(err.message || 'Failed to select template. Please try again.');
      setLoadingTemplateId(null);
    }
  };

  // Preview template function
  const handlePreviewTemplate = (templateId: string) => {
    console.log(`Previewing template: ${templateId}`);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setPreviewTemplate(template);
      setPreviewOpen(true);
    }
  };
  
  // Close preview dialog
  const handleClosePreview = () => {
    setPreviewOpen(false);
  };
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    
    // Update sorting based on tab
    if (newValue === 1) { // Popular tab
      setSortOption('popular');
    } else if (newValue === 2) { // New tab
      setSortOption('newest');
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Choose a Template
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            '& .MuiTab-root': { 
              fontWeight: 'bold',
              minWidth: 100 
            }
          }}
        >
          <Tab label="All" />
          <Tab label="Popular" />
          <Tab label="New" />
        </Tabs>
      </Box>
      
      {/* Search and filter */}
      <Paper elevation={0} sx={{ mb: 4, p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', flexGrow: 1 }}>
            <TextField
              placeholder="Search templates..."
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  pr: 5
                }
              }}
            />
            <SearchIcon sx={{ position: 'absolute', right: 14, top: 14, color: 'text.secondary' }} />
          </Box>
          
          <Tooltip title="Sort templates">
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <SortIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Filter templates">
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {showFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={selectedDifficulty}
                  label="Difficulty"
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {DIFFICULTY_LEVELS.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortOption}
                  label="Sort By"
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>
        )}
      </Paper>
      
      {/* Error message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={fetchTemplates}>
              Try Again
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      
      {/* Templates Grid */}
      <Box sx={{ mb: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <Box key={item} sx={{ height: '450px', mb: 1 }}>
                <Skeleton variant="rectangular" height={200} sx={{ mb: 1, borderRadius: 2 }} />
                <Skeleton variant="text" height={30} width="80%" />
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={20} width="40%" />
                <Box sx={{ mt: 2 }}>
                  <Skeleton variant="rectangular" height={36} width="100%" sx={{ borderRadius: 1 }} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {sortedTemplates.map((template) => (
              <Box key={template.id} sx={{ height: '450px' }}>
                <Box sx={{ height: '100%' }}>
                  <TemplateCard 
                    template={template}
                    onSelect={() => selectTemplate(template.id)}
                    onPreview={() => handlePreviewTemplate(template.id)}
                    isLoading={loadingTemplateId === template.id}
                    categoryColors={categoryColors}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      
      {/* No results message */}
      {!isLoading && sortedTemplates.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            No templates match your search criteria.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSortOption('popular');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
      
      {/* Template Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, overflow: 'hidden' }
        }}
      >
        {previewTemplate && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 2
            }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {previewTemplate.name}
              </Typography>
              <Chip 
                label={previewTemplate.category.charAt(0).toUpperCase() + previewTemplate.category.slice(1)}
                color="primary"
                sx={{ 
                  bgcolor: categoryColors[previewTemplate.category] || 'primary.main',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ position: 'relative' }}>
                <Box 
                  component="img"
                  src={previewTemplate.thumbnail}
                  alt={previewTemplate.name}
                  sx={{ 
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                />
                
                {previewTemplate.difficulty && (
                  <Chip
                    label={previewTemplate.difficulty.charAt(0).toUpperCase() + previewTemplate.difficulty.slice(1)}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      fontWeight: 'bold',
                      bgcolor: previewTemplate.difficulty === 'beginner' ? '#4CAF50' : 
                              previewTemplate.difficulty === 'intermediate' ? '#FF9800' : '#F44336',
                      color: 'white'
                    }}
                  />
                )}
                
                {previewTemplate.popularity && (
                  <Chip
                    avatar={<Avatar sx={{ bgcolor: 'rgba(0,0,0,0.5)' }}>👁️</Avatar>}
                    label={`${previewTemplate.popularity}+ users`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 'bold',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white'
                    }}
                  />
                )}
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {previewTemplate.description}
                </Typography>
                
                {previewTemplate.tags && previewTemplate.tags.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {previewTemplate.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          sx={{ borderColor: 'primary.light', color: 'primary.main' }} 
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                {previewTemplate.sections && previewTemplate.sections.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Included Sections
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {previewTemplate.sections.map((section, index) => (
                        <Chip 
                          key={index} 
                          label={section.type.charAt(0).toUpperCase() + section.type.slice(1)} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider'
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Theme Preview
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: previewTemplate.theme.primaryColor,
                      border: '2px solid',
                      borderColor: 'divider'
                    }} />
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: previewTemplate.theme.secondaryColor,
                      border: '2px solid',
                      borderColor: 'divider'
                    }} />
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: previewTemplate.theme.mode === 'dark' ? '#121212' : '#ffffff',
                      border: '2px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {previewTemplate.theme.mode.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button onClick={handleClosePreview} variant="outlined">
                Close
              </Button>
              <Button 
                onClick={() => {
                  handleClosePreview();
                  selectTemplate(previewTemplate.id);
                }} 
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
              >
                Use This Template
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
