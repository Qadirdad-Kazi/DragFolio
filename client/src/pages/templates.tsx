import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { templateApi, portfolioApi } from '../services/api';
import { Template } from '../types';

// Categories for filtering

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

export default function Templates() {
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setTemplates(data.filter((template: any) => template.isPublished));
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError('Failed to load templates. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter templates based on search query and category
  useEffect(() => {
    let filtered = templates;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(query) || 
        template.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredTemplates(filtered);
  }, [searchQuery, selectedCategory, templates]);

  // Handle template selection
  const selectTemplate = async (templateId: string) => {
    try {
      // Create a new portfolio based on the selected template
      const newPortfolio = await portfolioApi.create({
        title: 'New Portfolio',
        description: 'Created from template',
        template: templateId,
        isPublished: false
      });
      
      // Navigate to the editor with the new portfolio ID
      navigate(`/editor?id=${newPortfolio.id}`);
    } catch (err) {
      console.error('Failed to create portfolio from template:', err);
      setError('Failed to create portfolio from template. Please try again.');
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
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography color="text.secondary">Loading templates...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          <Button variant="contained" onClick={fetchTemplates}>Try Again</Button>
        </Box>
      ) : filteredTemplates.length === 0 ? (
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
      ) : (
        <Grid container spacing={4}>
          {filteredTemplates.map((template, index) => (
            <Grid key={template.id} sx={{ gridColumn: { xs: 12, md: 6, lg: 4 } }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{ height: '100%' }}
              >
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={template.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'}
                    alt={template.name}
                    sx={{ 
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {template.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {template.sections.map(section => (
                        <Chip 
                          key={section} 
                          label={section.charAt(0).toUpperCase() + section.slice(1)}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      fullWidth
                      onClick={() => window.open(`/preview?template=${template.id}`, '_blank')}
                    >
                      Preview
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small"
                      fullWidth
                      onClick={() => selectTemplate(template.id)}
                    >
                      Use Template
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
