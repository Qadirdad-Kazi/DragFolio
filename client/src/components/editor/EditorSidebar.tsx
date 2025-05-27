import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Portfolio, PortfolioSection, SectionType } from '@/types';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  Divider,
  Stack,
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
  Language as GlobeIcon,
  Save as SaveIcon,
  Delete as TrashIcon,
  DragIndicator as GripVerticalIcon,
  Check as CheckIcon,
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
  deployPortfolio: (subdomain: string) => Promise<any>;
  deletePortfolio: (id: string) => Promise<void>;
  isSaving: boolean;
}

// DnD item type
const SECTION_ITEM_TYPE = 'SECTION';

// Draggable section item
interface DraggableSectionProps {
  section: PortfolioSection;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableSection = ({
  section,
  index,
  isSelected,
  onSelect,
  onRemove,
  moveSection,
}: DraggableSectionProps) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: SECTION_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: SECTION_ITEM_TYPE,
    hover: (item: { index: number }, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      moveSection(dragIndex, hoverIndex);

      // Update the item's index
      item.index = hoverIndex;
    },
  });

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

  return (
    <Paper
      ref={(node) => drop(preview(node))}
      elevation={isSelected ? 2 : 0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        bgcolor: isSelected ? 'primary.light' : 'background.paper',
        border: isSelected ? 1 : 0,
        borderColor: 'primary.main',
        borderRadius: 1,
        opacity: isDragging ? 0.5 : 1,
        '&:hover': {
          bgcolor: isSelected ? 'primary.light' : 'action.hover',
        },
      }}
      onClick={onSelect}
    >
      <Box ref={drag} sx={{ mr: 1, cursor: 'grab' }}>
        <GripVerticalIcon fontSize="small" color="action" />
      </Box>
      <Box sx={{ mr: 1, color: 'text.secondary' }}>{getSectionIcon(section.type)}</Box>
      <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {section.title}
      </Typography>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        sx={{
          opacity: 0,
          '&:hover': { opacity: 1, color: 'error.main' },
          '.MuiPaper-root:hover &': { opacity: 0.7 },
        }}
      >
        <TrashIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default function EditorSidebar({
  portfolio,
  selectedSection,
  setSelectedSection,
  addSection,
  removeSection,
  reorderSections,
  savePortfolio,
  exportPortfolio,
  deployPortfolio,
  deletePortfolio,
  isSaving,
}: EditorSidebarProps) {
  const [subdomain, setSubdomain] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Handle deploy
  const handleDeploy = async () => {
    if (!subdomain) return;
    setIsDeploying(true);
    try {
      await deployPortfolio(subdomain);
      setDeployDialogOpen(false);
    } catch (error) {
      console.error('Failed to deploy portfolio:', error);
    } finally {
      setIsDeploying(false);
    }
  };

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

  // Handle section reordering
  const moveSection = (dragIndex: number, hoverIndex: number) => {
    reorderSections(dragIndex, hoverIndex);
  };

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
                .map((section, index) => (
                  <Box
                    key={section.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => setSelectedSection(section.id)}
                      size="small"
                    >
                      {selectedSection === section.id ? <CheckIcon fontSize="small" /> : null}
                    </IconButton>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {section.title}
                    </Typography>
                    <IconButton
                      onClick={() => removeSection(section.id)}
                      size="small"
                    >
                      <TrashIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
            )}
          </Box>
        </Box>

        {/* Actions */}
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon />}
                onClick={savePortfolio}
                disabled={isSaving}
                sx={{ justifyContent: 'flex-start' }}
              >
                {isSaving ? 'Saving...' : 'Save Portfolio'}
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={exportPortfolio}
                sx={{ justifyContent: 'flex-start' }}
              >
                Export as HTML
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GlobeIcon />}
                onClick={() => setDeployDialogOpen(true)}
                sx={{ justifyContent: 'flex-start' }}
              >
                Deploy to Subdomain
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: '50%' }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
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
      </Box>

      {/* Deploy Dialog */}
      <Dialog
        open={deployDialogOpen}
        onClose={() => !isDeploying && setDeployDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Deploy to Subdomain</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" gutterBottom>
              Enter a subdomain for your portfolio
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 2 }}>
              <TextField
                fullWidth
                label="Subdomain"
                placeholder="yourname"
                variant="outlined"
                size="small"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" color="text.secondary">
                        .portfoliohub.app
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setDeployDialogOpen(false)}
            disabled={isDeploying}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeploy}
            disabled={isDeploying || !subdomain}
            startIcon={isDeploying ? <CircularProgress size={16} /> : null}
          >
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </Button>
        </DialogActions>
      </Dialog>

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
