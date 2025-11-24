import { useDrop } from 'react-dnd';
import { Portfolio, PortfolioSection, PreviewDeviceType } from '@/types';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ResumeSection from './sections/ResumeSection';
import TestimonialsSection from './sections/TestimonialsSection';
import BlogSection from './sections/BlogSection';
import ContactSection from './sections/ContactSection';
import { Box, Paper, Typography, Tooltip, Button, Fade, Zoom, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider } from '../theme/ThemeProvider';

// Add some global styles for animations
import { keyframes } from '@emotion/react';

// Define keyframes for animations
// const fadeIn = keyframes`
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// `;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

// Styled components for enhanced UI
const CanvasContainer = styled(Box)(() => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const PreviewModeChip = styled(Chip)(() => ({
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 1000,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  fontWeight: 600,
  animation: `${float} 3s ease-in-out infinite`,
}));

// Use transient prop $active to prevent it from being passed to the DOM element
const DeviceButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$active',
})<{ $active?: boolean }>(({ $active }) => ({
  minWidth: 'auto',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: $active ? 'rgba(25, 118, 210, 0.1)' : 'rgba(255, 255, 255, 0.8)',
  border: $active ? '2px solid #1976d2' : '2px solid rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

interface EditorCanvasProps {
  portfolio: Portfolio;
  selectedSection: string | null;
  setSelectedSection: (id: string | null) => void;
  updateSection: (id: string, updates: Partial<PortfolioSection>) => void;
  previewDevice: PreviewDeviceType;
  setPreviewDevice: (device: PreviewDeviceType) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
}

// Define styles for the editor canvas
// const styles = {
//   sectionContainer: {
//     marginBottom: '24px',
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       transform: 'translateY(-2px)'
//     }
//   },
//   previewControls: {
//     display: 'flex',
//     justifyContent: 'center',
//     marginBottom: '16px',
//     padding: '8px',
//     borderRadius: '8px'
//   }
// }

// DnD item type
const SECTION_ITEM_TYPE = 'SECTION';

export default function EditorCanvas({
  portfolio,
  selectedSection,
  setSelectedSection,
  updateSection,
  previewDevice,
  setPreviewDevice,
  moveSection
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
      onMoveUp: () => moveSection(section.id, 'up'),
      onMoveDown: () => moveSection(section.id, 'down'),
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
      <CanvasContainer>
        <PreviewModeChip
          label={`📱 ${previewDevice.charAt(0).toUpperCase() + previewDevice.slice(1)} Preview`}
          variant="outlined"
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Enhanced Device Controls */}
          <Fade in={true}>
            <Paper
              elevation={8}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 4,
                p: 2,
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    mr: 2,
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🖥️ Preview Mode
                </Typography>
                <Tooltip title="Mobile View (375px)" arrow>
                  <DeviceButton
                    $active={previewDevice === 'mobile'}
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <PhoneAndroidIcon />
                  </DeviceButton>
                </Tooltip>
                <Tooltip title="Tablet View (768px)" arrow>
                  <DeviceButton
                    $active={previewDevice === 'tablet'}
                    onClick={() => setPreviewDevice('tablet')}
                  >
                    <TabletIcon />
                  </DeviceButton>
                </Tooltip>
                <Tooltip title="Desktop View (Full Width)" arrow>
                  <DeviceButton
                    $active={previewDevice === 'desktop'}
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <LaptopIcon />
                  </DeviceButton>
                </Tooltip>
              </Box>
            </Paper>
          </Fade>

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
                <Fade in={true}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '600px',
                    textAlign: 'center',
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(120, 119, 198, 0.1) 0%, rgba(255, 119, 198, 0.1) 100%)',
                  }}>
                    <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                      <Box sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                        animation: `${float} 3s ease-in-out infinite`,
                      }}>
                        <AddIcon sx={{ fontSize: 48, color: 'white' }} />
                      </Box>
                    </Zoom>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        mb: 2,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ✨ Start Your Journey
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 4,
                        maxWidth: '400px',
                        color: 'text.secondary',
                        fontSize: '1.1rem',
                        lineHeight: 1.6
                      }}
                    >
                      Your canvas is ready! Add sections from the sidebar to create an amazing portfolio that showcases your unique story.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      sx={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        borderRadius: '12px',
                        padding: '12px 32px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd8, #6b42a0)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                        },
                      }}
                    >
                      🚀 Add Your First Section
                    </Button>
                  </Box>
                </Fade>
              ) : (
                <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  {portfolio.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <Zoom
                        key={section.id}
                        in={true}
                        style={{ transitionDelay: `${index * 150}ms` }}
                      >
                        <Box
                          sx={{
                            mb: 5,
                            p: 2,
                            borderRadius: '16px',
                            backgroundColor: selectedSection === section.id
                              ? 'rgba(102, 126, 234, 0.1)'
                              : 'transparent',
                            border: selectedSection === section.id
                              ? '2px solid rgba(102, 126, 234, 0.3)'
                              : '2px solid transparent',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            '&:hover': {
                              backgroundColor: 'rgba(102, 126, 234, 0.05)',
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
                            },
                            '&::before': selectedSection === section.id ? {
                              content: '""',
                              position: 'absolute',
                              top: -2,
                              left: -2,
                              right: -2,
                              bottom: -2,
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              borderRadius: '18px',
                              zIndex: -1,
                              opacity: 1,
                              boxShadow: '0 0 15px rgba(118, 75, 162, 0.5)',
                            } : {},
                          }}
                        >
                          {renderSection(section)}
                        </Box>
                      </Zoom>
                    ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </CanvasContainer>
    </ThemeProvider>
  );
}
