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
} from '@mui/material';
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
      <Box
        sx={{
          height: 'calc(100vh - 80px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Portfolio Builder
        </Typography>

        {/* Add Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add Section
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<UserIcon />}
                onClick={() => addSection('about')}
                sx={{ justifyContent: 'flex-start' }}
              >
                About Me
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<CodeIcon />}
                onClick={() => addSection('projects')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Projects
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<AwardIcon />}
                onClick={() => addSection('skills')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Skills
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<FileTextIcon />}
                onClick={() => addSection('resume')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Resume
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<MessageSquareIcon />}
                onClick={() => addSection('testimonials')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Testimonials
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<BookOpenIcon />}
                onClick={() => addSection('blog')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Blog
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<MailIcon />}
                onClick={() => addSection('contact')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Contact
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Sections List */}
        <Box sx={{ flexGrow: 1, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Sections
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {portfolio.sections.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center', borderStyle: 'dashed', bgcolor: 'background.default' }}>
                <Typography variant="body2" color="text.secondary">
                  No sections added yet. Add a section to get started.
                </Typography>
              </Box>
            ) : (
              portfolio.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <Paper
                    key={section.id}
                    elevation={selectedSection === section.id ? 2 : 0}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      mb: 1,
                      bgcolor: selectedSection === section.id ? 'primary.light' : 'background.paper',
                      border: selectedSection === section.id ? 1 : 0,
                      borderColor: 'primary.main',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: selectedSection === section.id ? 'primary.light' : 'action.hover',
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
                ))
            )}
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: 'text.secondary' }}>
            Portfolio Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportPortfolio}
              sx={{ 
                justifyContent: 'flex-start',
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              Export Portfolio
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<TrashIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isSaving}
              sx={{ justifyContent: 'flex-start' }}
            >
              Delete Portfolio
            </Button>
          </Box>
        </Box>
      </Box>

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
