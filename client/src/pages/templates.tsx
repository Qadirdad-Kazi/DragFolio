import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Chip,
  Skeleton,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { templateApi, portfolioApi } from '../services/api';
import { Template } from '../types';

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

export default function Templates() {
  // We don't need navigate anymore since we're using window.location.href
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter out custom templates for display
  const systemTemplates = templates.filter((template: Template) => !template.isCustom);

  // Filter templates based on search and category
  const filteredTemplates = systemTemplates.filter((template: Template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
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
      setTemplates(data.filter((template: any) => template.isPublic));
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
      setIsLoading(true);
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
      
      const newPortfolio = await portfolioApi.create(portfolioData);
      
      // Navigate to the editor with the portfolio ID
      window.location.href = `/editor?portfolio=${newPortfolio.id}`;
    } catch (err: any) {
      console.error('Failed to create portfolio from template:', err);
      setError(err.message || 'Failed to create portfolio from template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template deletion
  const deleteTemplate = async (templateId: string) => {
    const template = templates.find((t: Template) => t.id === templateId);
    if (!template) {
      setError('Template not found');
      return;
    }

    // Only allow deletion of user-created templates
    if (!template.isCustom) {
      setError('System templates cannot be deleted. Please manage your templates from your dashboard.');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the "${template.name}" template? This action cannot be undone.`);
    if (!confirmDelete) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await templateApi.delete(templateId);
      
      // Remove the deleted template from the local state
      setTemplates(templates.filter((t: Template) => t.id !== templateId));
      
      setError('Template deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete template:', err);
      setError(err.message || 'Failed to delete template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Choose a Template
      </Typography>
      
      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ gridColumn: { xs: 12, md: 8 } }}>
          <TextField
            fullWidth
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            label="Search"
          />
        </Grid>
        <Grid sx={{ gridColumn: { xs: 12, md: 4 } }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as string)}
              label="Category"
            >
              {CATEGORIES.map(category => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Templates Grid */}
      {isLoading ? (
        <Grid container spacing={4}>
          {[...Array(10)].map((_, index) => (
            <Grid key={index} sx={{ gridColumn: { xs: 12, md: 6, lg: 4 } }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" height={24} width="80%" />
                  <Skeleton variant="text" height={24} width="60%" />
                  <Skeleton variant="text" height={24} width="40%" />
                  <Skeleton variant="text" height={24} width="30%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          <Button variant="contained" onClick={fetchTemplates}>Try Again</Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredTemplates.map((template, index) => (
            <Grid key={index} sx={{ gridColumn: { xs: 12, md: 6, lg: 4 } }}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6
                  },
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={template.thumbnail || `/assets/templates/${template.category}.jpg`}
                  alt={template.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    backgroundColor: '#f5f5f5'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))',
                    pointerEvents: 'none'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {CATEGORIES.find(cat => cat.value === template.category)?.color && (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: CATEGORIES.find(cat => cat.value === template.category)?.color,
                          mr: 1
                        }}
                      />
                    )}
                    <Typography variant="h6" component="h2" gutterBottom>
                      {template.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {template.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {template.tags?.map((tag: string, i: number) => (
                      <Chip
                        key={i}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: 'primary.light',
                          color: 'primary.main'
                        }}
                      />
                    ))}
                    <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                      {template.isCustom && (
                        <Typography variant="caption" color="text.secondary">
                          Custom
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Sections
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {template.sections?.map((section, i) => (
                        <Chip
                          key={i}
                          label={section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Category
                    </Typography>
                    <Chip
                      label={CATEGORIES.find(cat => cat.value === template.category)?.label || 'Unknown'}
                      size="small"
                      sx={{
                        bgcolor: CATEGORIES.find(cat => cat.value === template.category)?.color,
                        color: 'white'
                      }}
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => selectTemplate(template.id)}
                    startIcon={<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} />}
                    disabled={isLoading}
                    sx={{
                      '&:disabled': {
                        opacity: 0.7,
                        pointerEvents: 'none'
                      }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'Use Template'
                    )}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {filteredTemplates.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary" sx={{ mb: 3 }}>No templates match your search criteria.</Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Container>
  );
}