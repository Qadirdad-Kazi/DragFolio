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

  // Extract IDs from the URL
  const getIds = () => {
    try {
      // Log the full location to help debug
      console.log('Current location:', location);
      
      // In Wouter, location is just the pathname without query params
      // So we need to use window.location.search to get the query string
      const queryString = window.location.search;
      console.log('Query string from window.location.search:', queryString);
      
      // Parse the query parameters
      const searchParams = new URLSearchParams(queryString);
      
      // Get the template ID or portfolio ID
      const templateId = searchParams.get('template');
      const portfolioId = searchParams.get('id');
      
      console.log('Extracted template ID:', templateId);
      console.log('Extracted portfolio ID:', portfolioId);
      
      return { templateId: templateId || '', portfolioId: portfolioId || '' };
    } catch (err) {
      console.error('Error extracting IDs:', err);
      return { templateId: '', portfolioId: '' };
    }
  };

  const { templateId, portfolioId } = getIds();
  
  // Fetch template or portfolio when component mounts
  useEffect(() => {
    console.log('IDs from URL - Template:', templateId, 'Portfolio:', portfolioId);
    
    if (!templateId && !portfolioId) {
      setError('No template or portfolio ID provided');
      setIsLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        // If we have a portfolio ID, fetch the portfolio for preview
        if (portfolioId) {
          console.log('Making API call to fetch portfolio with ID:', portfolioId);
          const data = await fetch(`/api/portfolios/${portfolioId}`).then(res => res.json());
          console.log('Portfolio data received:', data);
          setTemplate(data);
        } 
        // Otherwise, fetch the template
        else if (templateId) {
          console.log('Making API call to fetch template with ID:', templateId);
          const data = await templateApi.getById(templateId);
          console.log('Template data received:', data);
          setTemplate(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Error: ' + (error instanceof Error ? error.message : String(error)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [templateId, portfolioId]);

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
