import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { templateApi } from '../services/api';
import { Template } from '../types';

export default function TemplatePreview() {
  const [location, navigate] = useLocation();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Directly extract the template ID from the URL
  const getTemplateId = () => {
    try {
      // Log the full location to help debug
      console.log('Current location:', location);
      
      // Extract the query string
      const queryString = location.includes('?') ? location.split('?')[1] : '';
      console.log('Query string:', queryString);
      
      // Parse the query parameters
      const searchParams = new URLSearchParams(queryString);
      
      // Get the template ID
      const id = searchParams.get('template');
      console.log('Extracted template ID:', id);
      
      return id || '';
    } catch (err) {
      console.error('Error extracting template ID:', err);
      return '';
    }
  };

  const templateId = getTemplateId();
  
  // Fetch template when component mounts
  useEffect(() => {
    console.log('Template ID from URL:', templateId);
    
    if (!templateId) {
      setError('No template ID provided');
      setIsLoading(false);
      return;
    }
    
    // Debug the API call
    console.log('Fetching template with ID:', templateId);

    const fetchTemplate = async () => {
      try {
        console.log('Making API call to fetch template with ID:', templateId);
        const data = await templateApi.getById(templateId);
        console.log('Template data received:', data);
        setTemplate(data);
      } catch (error) {
        console.error('Error fetching template:', error);
        setError('Failed to load template. Error: ' + (error instanceof Error ? error.message : String(error)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplate();
  }, [templateId]);

  // Handle back button click
  const handleBack = () => {
    navigate('/templates');
  };

  // Handle use template button click
  const handleUseTemplate = () => {
    if (template) {
      navigate(`/templates?action=create&template=${template.id}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back to Templates
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Template Preview
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>
      ) : template ? (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Box sx={{ flex: '0 0 300px' }}>
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {template.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {template.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    Category:
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ textTransform: 'capitalize' }}>
                    {template.category}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={handleUseTemplate}
                  sx={{ mt: 2 }}
                >
                  Use This Template
                </Button>
              </Box>
            </Box>
          </Paper>

          <Typography variant="h5" component="h2" gutterBottom>
            Sections
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {template.sections.map((section) => (
              <Paper key={section.id} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type: <span style={{ textTransform: 'capitalize' }}>{section.type}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Layout: <span style={{ textTransform: 'capitalize' }}>{section.layout}</span>
                </Typography>
              </Paper>
            ))}
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleUseTemplate}
            >
              Use This Template
            </Button>
          </Box>
        </>
      ) : (
        <Alert severity="warning" sx={{ my: 4 }}>Template not found</Alert>
      )}
    </Container>
  );
}
