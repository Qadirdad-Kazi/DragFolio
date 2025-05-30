import { useDrop } from 'react-dnd';
import { Portfolio, PortfolioSection, PreviewDeviceType } from '@/types';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ResumeSection from './sections/ResumeSection';
import TestimonialsSection from './sections/TestimonialsSection';
import BlogSection from './sections/BlogSection';
import ContactSection from './sections/ContactSection';
import { Box, Paper, Typography, Tooltip, Button } from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider } from '../theme/ThemeProvider';

// Add some global styles for animations
import { keyframes } from '@emotion/react';

// Define keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface EditorCanvasProps {
  portfolio: Portfolio;
  selectedSection: string | null;
  setSelectedSection: (id: string | null) => void;
  updateSection: (id: string, updates: Partial<PortfolioSection>) => void;
  previewDevice: PreviewDeviceType;
}

// Define styles for the editor canvas
const styles = {
  sectionContainer: {
    marginBottom: '24px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)'
    }
  },
  previewControls: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
    padding: '8px',
    borderRadius: '8px'
  }
}

// DnD item type
const SECTION_ITEM_TYPE = 'SECTION';

export default function EditorCanvas({
  portfolio,
  selectedSection,
  setSelectedSection,
  updateSection,
  previewDevice
}: EditorCanvasProps) {
  // Set up drop target for canvas
  const [{ isOver }, drop] = useDrop({
    accept: SECTION_ITEM_TYPE,
    drop: () => ({ name: 'Canvas' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Render section based on type
  const renderSection = (section: PortfolioSection) => {
    const isSelected = selectedSection === section.id;
    const templateCategory = portfolio.template || 'professional';
    
    const commonProps = {
      section,
      isSelected,
      onSelect: () => setSelectedSection(section.id),
      updateSection: (updates: Partial<PortfolioSection>) => updateSection(section.id, updates),
      templateCategory,
    };
    
    switch (section.type) {
      case 'about':
        return <AboutSection {...commonProps} />;
      case 'projects':
        return <ProjectsSection {...commonProps} />;
      case 'skills':
        return <SkillsSection {...commonProps} />;
      case 'resume':
        return <ResumeSection {...commonProps} />;
      case 'testimonials':
        return <TestimonialsSection {...commonProps} />;
      case 'blog':
        return <BlogSection {...commonProps} />;
      case 'contact':
        return <ContactSection {...commonProps} />;
      default:
        return null;
    }
  };

  // Get preview width based on device
  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile':
        // Mobile view with max width
        return { 
          width: '100%', 
          maxWidth: '375px', 
          mx: 'auto',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        };
      case 'tablet':
        return { 
          width: '100%', 
          maxWidth: '768px', 
          mx: 'auto',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        };
      case 'desktop':
      default:
        return { 
          width: '100%',
          boxShadow: '0 0 15px rgba(0,0,0,0.05)'
        };
    }
  };

  // We'll apply theme styles directly to the Paper component

  return (
    <ThemeProvider initialTheme={portfolio.theme}>
      <Box 
        sx={{ 
          height: 'calc(100vh - 80px)', 
          overflow: 'auto', 
          p: 3,
          backgroundColor: portfolio.theme.mode === 'dark' ? '#121212' : '#f5f5f5',
          transition: 'all 0.3s ease'
        }}>
        {/* Device frame controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 3,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: portfolio.theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          p: 1,
          borderRadius: 1.5,
          backgroundColor: portfolio.theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
        }}>
          <Typography variant="subtitle2" sx={{ mr: 1, fontWeight: 'medium' }}>Preview as:</Typography>
          <Tooltip title="Mobile View (375px)">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('set-preview-device', { detail: 'mobile' }))}
              className={`p-2 rounded-lg transition-all duration-200 ${previewDevice === 'mobile' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <PhoneAndroidIcon fontSize="small" />
            </button>
          </Tooltip>
          <Tooltip title="Tablet View (768px)">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('set-preview-device', { detail: 'tablet' }))}
              className={`p-2 rounded-lg transition-all duration-200 ${previewDevice === 'tablet' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <TabletIcon fontSize="small" />
            </button>
          </Tooltip>
          <Tooltip title="Desktop View (Full Width)">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('set-preview-device', { detail: 'desktop' }))}
              className={`p-2 rounded-lg transition-all duration-200 ${previewDevice === 'desktop' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <LaptopIcon fontSize="small" />
            </button>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Canvas with device frame */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mb: 3,
        position: 'relative',
        '&::before': previewDevice !== 'desktop' ? {
          content: '""',
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: previewDevice === 'mobile' ? '40%' : '30%',
          height: '8px',
          borderRadius: '4px',
          backgroundColor: 'rgba(0,0,0,0.1)',
          zIndex: 1
        } : {}
      }}>
        <Paper
          ref={drop}
          elevation={3}
          sx={{
            minHeight: '600px',
            borderRadius: previewDevice === 'mobile' ? '16px' : previewDevice === 'tablet' ? '8px' : '4px',
            bgcolor: portfolio.theme.mode === 'dark' ? 'grey.900' : 'background.paper',
            color: portfolio.theme.mode === 'dark' ? 'common.white' : 'text.primary',
            border: 1,
            borderColor: isOver ? 'primary.main' : 'divider',
            borderStyle: isOver ? 'dashed' : 'solid',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            ...getPreviewWidth()
          }}
        >
        {portfolio.sections.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '600px', 
            textAlign: 'center', 
            p: 4,
            backgroundColor: portfolio.theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)'
          }}>
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              borderRadius: '50%', 
              backgroundColor: portfolio.theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
            }}>
              <AddIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
            </Box>
            <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
              Your Portfolio is Empty
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, maxWidth: '400px', color: portfolio.theme.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>
              Add sections from the sidebar to start building your professional portfolio.
            </Typography>
            <Button variant="outlined" color="primary" startIcon={<AddIcon />}>
              Add Your First Section
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {portfolio.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <Box key={section.id} sx={{ mb: 5, animation: `${fadeIn} 0.5s ease-in-out`, ...styles.sectionContainer }}>
                  {renderSection(section)}
                </Box>
              ))}
          </Box>
        )}
        </Paper>
      </Box>
    </Box>
    </ThemeProvider>
  );
}
