import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper,
  Alert,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import { templateApi } from '../services/api';
import { Template, Portfolio, PortfolioSection, PreviewDeviceType } from '../types';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { styled } from '@mui/material/styles';

// Import section components
import AboutSection from '../components/editor/sections/AboutSection';
import ProjectsSection from '../components/editor/sections/ProjectsSection';
import SkillsSection from '../components/editor/sections/SkillsSection';
import ResumeSection from '../components/editor/sections/ResumeSection';
import TestimonialsSection from '../components/editor/sections/TestimonialsSection';
import BlogSection from '../components/editor/sections/BlogSection';
import ContactSection from '../components/editor/sections/ContactSection';

// Styled components
const PreviewContainer = styled(Box)(() => ({
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  paddingTop: '80px', // Space for fixed header
  paddingBottom: '40px',
  transition: 'background-color 0.3s ease',
}));

const DeviceButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$active',
})<{ $active?: boolean }>(({ $active }) => ({
  minWidth: 'auto',
  padding: '10px 16px',
  borderRadius: '12px',
  backgroundColor: $active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
  color: $active ? '#2563eb' : '#64748b',
  border: $active ? '1px solid #2563eb' : '1px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    color: '#2563eb',
  },
}));

const PreviewFrame = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'width',
})<{ width: string }>(({ width }) => ({
  width: width,
  margin: '0 auto',
  minHeight: '800px',
  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
  borderRadius: width === '100%' ? '0' : '16px',
  border: width === '100%' ? 'none' : '1px solid rgba(0,0,0,0.05)',
}));

export default function TemplatePreview() {
  const [_, navigate] = useLocation();
  const [data, setData] = useState<Template | Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<PreviewDeviceType>('desktop');

  // Extract IDs from the URL
  const getIds = () => {
    try {
      const queryString = window.location.search;
      const searchParams = new URLSearchParams(queryString);
      const templateId = searchParams.get('template');
      const portfolioId = searchParams.get('id');
      return { templateId: templateId || '', portfolioId: portfolioId || '' };
    } catch (err) {
      console.error('Error extracting IDs:', err);
      return { templateId: '', portfolioId: '' };
    }
  };

  const { templateId, portfolioId } = getIds();

  // Fetch data
  useEffect(() => {
    if (!templateId && !portfolioId) {
      setError('No template or portfolio ID provided');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        if (portfolioId) {
          const response = await fetch(`/api/portfolios/${portfolioId}`);
          if (!response.ok) throw new Error('Failed to fetch portfolio');
          const portfolioData = await response.json();
          setData(portfolioData);
        } else if (templateId) {
          const templateData = await templateApi.getById(templateId);
          setData(templateData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load preview. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [templateId, portfolioId]);

  // Handle back button click
  const handleBack = () => {
    if (portfolioId) {
      navigate('/dashboard');
    } else {
      navigate('/templates');
    }
  };

  // Handle use template button click
  const handleUseTemplate = () => {
    if (data && 'id' in data && templateId) {
      navigate(`/templates?action=create&template=${data.id}`);
    }
  };

  // Handle edit portfolio button click
  const handleEditPortfolio = () => {
    if (portfolioId) {
      navigate(`/editor?id=${portfolioId}`);
    }
  };

  // Get preview width based on device
  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  // Render section based on type
  const renderSection = (section: PortfolioSection) => {
    const commonProps = {
      section,
      isSelected: false,
      onSelect: () => { },
      updateSection: () => { }, // Read-only
      templateCategory: (data as any).template || 'professional',
    };

    switch (section.type) {
      case 'about': return <AboutSection {...commonProps} />;
      case 'projects': return <ProjectsSection {...commonProps} />;
      case 'skills': return <SkillsSection {...commonProps} />;
      case 'resume': return <ResumeSection {...commonProps} />;
      case 'testimonials': return <TestimonialsSection {...commonProps} />;
      case 'blog': return <BlogSection {...commonProps} />;
      case 'contact': return <ContactSection {...commonProps} />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error || 'Data not found'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9' }}>
      {/* Fixed Header */}
      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'rgba(0,0,0,0.04)' } }}
          >
            Back
          </Button>
          <Typography variant="subtitle1" fontWeight="600" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {(data as any).title || (data as any).name || 'Preview'}
          </Typography>
        </Box>

        {/* Device Switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f1f5f9', p: 0.5, borderRadius: '12px' }}>
          <Tooltip title="Mobile View">
            <DeviceButton $active={previewDevice === 'mobile'} onClick={() => setPreviewDevice('mobile')}>
              <PhoneAndroidIcon fontSize="small" />
            </DeviceButton>
          </Tooltip>
          <Tooltip title="Tablet View">
            <DeviceButton $active={previewDevice === 'tablet'} onClick={() => setPreviewDevice('tablet')}>
              <TabletIcon fontSize="small" />
            </DeviceButton>
          </Tooltip>
          <Tooltip title="Desktop View">
            <DeviceButton $active={previewDevice === 'desktop'} onClick={() => setPreviewDevice('desktop')}>
              <LaptopIcon fontSize="small" />
            </DeviceButton>
          </Tooltip>
        </Box>

        <Box>
          {templateId ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUseTemplate}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Use Template
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditPortfolio}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Edit Portfolio
            </Button>
          )}
        </Box>
      </Paper>

      {/* Preview Content */}
      <PreviewContainer>
        <ThemeProvider initialTheme={(data as any).theme}>
          <PreviewFrame width={getPreviewWidth()} elevation={previewDevice === 'desktop' ? 0 : 4}>
            <Box sx={{
              bgcolor: (data as any).theme?.mode === 'dark' ? '#111827' : '#ffffff',
              minHeight: '100%',
              color: (data as any).theme?.mode === 'dark' ? '#ffffff' : '#000000',
            }}>
              {/* Render Sections */}
              {(data as any).sections && (data as any).sections.length > 0 ? (
                (data as any).sections
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((section: PortfolioSection) => (
                    <Box key={section.id}>
                      {renderSection(section)}
                    </Box>
                  ))
              ) : (
                <Box sx={{ py: 10, textAlign: 'center' }}>
                  <Typography variant="h5" color="text.secondary">
                    No sections to display
                  </Typography>
                </Box>
              )}
            </Box>
          </PreviewFrame>
        </ThemeProvider>
      </PreviewContainer>
    </Box>
  );
}
