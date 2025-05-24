import { useDrop } from 'react-dnd';
import { Portfolio, PortfolioSection, PreviewDeviceType } from '@/types';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ResumeSection from './sections/ResumeSection';
import TestimonialsSection from './sections/TestimonialsSection';
import BlogSection from './sections/BlogSection';
import ContactSection from './sections/ContactSection';
import { Box, Typography, Paper } from '@mui/material';

interface EditorCanvasProps {
  portfolio: Portfolio;
  selectedSection: string | null;
  setSelectedSection: (id: string | null) => void;
  updateSection: (id: string, updates: Partial<PortfolioSection>) => void;
  previewDevice: PreviewDeviceType;
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
    
    const commonProps = {
      section,
      isSelected,
      onSelect: () => setSelectedSection(section.id),
      updateSection: (updates: Partial<PortfolioSection>) => updateSection(section.id, updates),
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

  // Apply theme styles
  const themeStyles = {
    fontFamily: portfolio.theme.fontFamily,
    fontSize: portfolio.theme.fontSize,
    '--primary-color': portfolio.theme.primaryColor,
    '--secondary-color': portfolio.theme.secondaryColor,
  } as React.CSSProperties;

  // Get preview width based on device
  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile':
        // Mobile view with max width
        return { width: '100%', maxWidth: '375px', mx: 'auto' };
      case 'tablet':
        return { width: '100%', maxWidth: '768px', mx: 'auto' };
      case 'desktop':
      default:
        return { width: '100%' };
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', overflow: 'auto', p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">{portfolio.title}</Typography>
        <Typography variant="body1" color="text.secondary">{portfolio.description}</Typography>
      </Box>
      
      <Paper
        ref={drop}
        elevation={1}
        sx={{
          minHeight: '500px',
          borderRadius: 1,
          bgcolor: portfolio.theme.mode === 'dark' ? 'grey.900' : 'background.paper',
          color: portfolio.theme.mode === 'dark' ? 'common.white' : 'text.primary',
          border: 1,
          borderColor: isOver ? 'primary.main' : 'divider',
          borderStyle: isOver ? 'dashed' : 'solid',
          ...getPreviewWidth()
        }}
      >
        {portfolio.sections.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '500px', 
            textAlign: 'center', 
            p: 4 
          }}>
            <Typography variant="h5" fontWeight="medium" sx={{ mb: 1 }}>
              Your Portfolio is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Add sections from the sidebar to start building your portfolio.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            {portfolio.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <Box key={section.id} sx={{ mb: 4 }}>
                  {renderSection(section)}
                </Box>
              ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
