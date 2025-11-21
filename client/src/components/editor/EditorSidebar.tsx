import { useState } from 'react';
import { Portfolio, SectionType } from '@/types';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Fade,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person as UserIcon,
  Code as CodeIcon,
  EmojiEvents as AwardIcon,
  Description as FileTextIcon,
  ChatBubble as MessageSquareIcon,
  MenuBook as BookOpenIcon,
  Mail as MailIcon,
  GetApp as DownloadIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';

interface EditorSidebarProps {
  portfolio: Portfolio;
  selectedSection: string | null;
  setSelectedSection: (id: string | null) => void;
  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
  savePortfolio: () => Promise<any>;
  exportPortfolio: () => Promise<void>;
  // Deployment functionality removed
  deletePortfolio: (id: string) => Promise<void>;
  isSaving: boolean;
}

// Styled components for enhanced UI
const StyledSidebar = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  padding: '24px',
  margin: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
}));

const SectionButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: '12px',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(5px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

// Section management functions

// Get icon for section type
const getSectionIcon = (type: SectionType) => {
  switch (type) {
    case 'about':
      return <UserIcon fontSize="small" />;
    case 'projects':
      return <CodeIcon fontSize="small" />;
    case 'skills':
      return <AwardIcon fontSize="small" />;
    case 'resume':
      return <FileTextIcon fontSize="small" />;
    case 'testimonials':
      return <MessageSquareIcon fontSize="small" />;
    case 'blog':
      return <BookOpenIcon fontSize="small" />;
    case 'contact':
      return <MailIcon fontSize="small" />;
    default:
      return null;
  }
};

export default function EditorSidebar({
  portfolio,
  selectedSection,
  setSelectedSection,
  addSection,
  removeSection,
  reorderSections,
  exportPortfolio,
  // deployPortfolio removed,
  deletePortfolio,
  isSaving,
}: EditorSidebarProps) {
  // Deployment state removed
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Deployment handler removed

  // Handle delete
  const handleDelete = async () => {
    try {
      await deletePortfolio(portfolio.id as string);
      // Navigate away or show success message
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Handle section reordering directly with reorderSections

  return (
    <>
      <StyledSidebar
        sx={{
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #fff, #e3f2fd)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🚀 Portfolio Builder
        </Typography>

        {/* Portfolio Info */}
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
            {portfolio.title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, color: 'white' }}>
            {portfolio.sections?.length || 0} sections • Last saved {new Date().toLocaleDateString()}
          </Typography>
        </Paper>

        {/* Add Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
            ➕ Add Sections
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Tooltip title="Add an About Me section" arrow>
              <SectionButton
                startIcon={<UserIcon />}
                onClick={() => addSection('about')}
              >
                About Me
              </SectionButton>
            </Tooltip>
            <Tooltip title="Showcase your projects" arrow>
              <SectionButton
                startIcon={<CodeIcon />}
                onClick={() => addSection('projects')}
              >
                Projects
              </SectionButton>
            </Tooltip>
            <Tooltip title="Display your skills" arrow>
              <SectionButton
                startIcon={<AwardIcon />}
                onClick={() => addSection('skills')}
              >
                Skills
              </SectionButton>
            </Tooltip>
            <Tooltip title="Add your resume" arrow>
              <SectionButton
                startIcon={<FileTextIcon />}
                onClick={() => addSection('resume')}
              >
                Resume
              </SectionButton>
            </Tooltip>
            <Tooltip title="Add testimonials" arrow>
              <SectionButton
                startIcon={<MessageSquareIcon />}
                onClick={() => addSection('testimonials')}
              >
                Testimonials
              </SectionButton>
            </Tooltip>
            <Tooltip title="Add a blog section" arrow>
              <SectionButton
                startIcon={<BookOpenIcon />}
                onClick={() => addSection('blog')}
              >
                Blog
              </SectionButton>
            </Tooltip>
            <Tooltip title="Add contact information" arrow>
              <SectionButton
                startIcon={<MailIcon />}
                onClick={() => addSection('contact')}
              >
                Contact
              </SectionButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Sections List */}
        <Box sx={{ flexGrow: 1, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
            📋 Your Sections
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {portfolio.sections.length === 0 ? (
              <Fade in={true}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderStyle: 'dashed', 
                  borderWidth: 2,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                    ✨ No sections added yet. Start building your amazing portfolio!
                  </Typography>
                </Paper>
              </Fade>
            ) : (
              portfolio.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }} key={section.id}>
                    <Paper
                      elevation={selectedSection === section.id ? 8 : 2}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        mb: 1,
                        backgroundColor: selectedSection === section.id 
                          ? 'rgba(255, 255, 255, 0.25)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        border: selectedSection === section.id ? 2 : 1,
                        borderColor: selectedSection === section.id 
                          ? 'rgba(255, 255, 255, 0.5)' 
                          : 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                      onClick={() => setSelectedSection(section.id)}
                  >
                    <Box sx={{ mr: 1, color: 'text.secondary' }}>{getSectionIcon(section.type)}</Box>
                    <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: selectedSection === section.id ? 'medium' : 'normal' }}>
                      {section.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSection(section.id);
                      }}
                      sx={{
                        color: 'error.main',
                        opacity: 0.7,
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      <TrashIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                  </Zoom>
                ))
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Actions */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
            🎯 Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ActionButton
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportPortfolio}
              sx={{ 
                background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                color: 'white',
                '&:hover': { 
                  background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                }
              }}
            >
              📄 Export Portfolio
            </ActionButton>
            
            <ActionButton
              variant="outlined"
              startIcon={<TrashIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isSaving}
              sx={{ 
                borderColor: 'rgba(244, 67, 54, 0.5)',
                color: '#f44336',
                '&:hover': { 
                  borderColor: '#f44336',
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                }
              }}
            >
              🗑️ Delete Portfolio
            </ActionButton>
          </Box>
        </Box>
      </StyledSidebar>

      {/* Deployment dialog removed */}

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Portfolio</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Delete Portfolio
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Are you sure you want to delete this portfolio? This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} /> : null}
          >
            {isSaving ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
