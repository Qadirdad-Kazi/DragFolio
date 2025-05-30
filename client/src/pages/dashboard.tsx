import { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import { useLocation } from 'wouter';
import { SectionType, Portfolio, Template } from '../types';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
  Stack,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';

import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { portfolioApi, templateApi } from '../services/api';

function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const [_, navigate] = useLocation();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  type TabType = 'portfolios' | 'all' | 'published' | 'drafts' | 'templates';
  const [activeTab, setActiveTab] = useState<TabType>('portfolios');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [isDeleteTemplateDialogOpen, setIsDeleteTemplateDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolios();
      fetchUserTemplates();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchPortfolios = async () => {
    setIsLoading(true);
    try {
      const data = await portfolioApi.getAll();
      setPortfolios(data);
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const data = await templateApi.getAll();
      // Check if user is admin - if so, show all templates
      // Otherwise, filter to show only user's templates (custom templates)
      const userTemplates = user?.role === 'admin' 
        ? data
        : data.filter((template: Template) => template.isCustom);
      setTemplates(userTemplates);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const filteredPortfolios = portfolios.filter(portfolio => {
    // First check if we're in the portfolios tab
    if (activeTab !== 'portfolios') {
      return false;
    }
    
    // Then apply the filter status
    if (filterStatus === 'all') {
      return true;
    } else if (filterStatus === 'published') {
      return portfolio.isPublished;
    } else if (filterStatus === 'draft') {
      return !portfolio.isPublished;
    }
    return true;
  });

  const filteredTemplates = templates.filter(() => activeTab === 'templates');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreatePortfolio = async () => {
    if (!newPortfolioName.trim()) return;
    
    setIsLoadingAction(true);
    try {
      // Ensure we have a valid user ID
      if (!user?.id) {
        throw new Error('User ID is required to create a portfolio');
      }
      
      // Create a properly structured portfolio object with typed sections
      const portfolioData = {
        title: newPortfolioName.trim(),
        description: newPortfolioDescription?.trim() || 'My professional portfolio',
        isPublished: false,
        userId: user.id,
        // Add required sections array with at least one section
        sections: [
          {
            id: `section-${Date.now()}`,
            type: 'about' as SectionType, // Explicitly cast to SectionType
            title: 'About Me',
            content: { text: 'Welcome to my portfolio' },
            order: 0,
            layout: 'full' as 'full' | 'half' | 'two-columns' // Explicitly cast layout
          }
        ],
        // Add required theme object
        theme: {
          mode: 'light' as 'light' | 'dark', // Explicitly cast theme mode
          primaryColor: '#3490dc',
          secondaryColor: '#ffed4a',
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px'
        }
      };
      
      console.log('Creating portfolio with validated data:', portfolioData);
      // Cast the data to the correct type to satisfy TypeScript
      const newPortfolio = await portfolioApi.create(portfolioData as Partial<Portfolio>);
      
      // Update local state and navigate to editor
      setPortfolios([newPortfolio, ...portfolios]);
      setIsCreateDialogOpen(false);
      setNewPortfolioName('');
      setNewPortfolioDescription('');
      
      // Show success message
      alert(`Portfolio "${newPortfolioName}" created successfully!`);
      
      // Navigate to editor
      navigate(`/editor?id=${newPortfolio.id}`);
    } catch (err) {
      console.error('Failed to create portfolio:', err);
      alert('Failed to create portfolio. Please try again.');
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDeleteTemplate = async () => {
    // Validate template exists and has an ID
    if (!templateToDelete) {
      console.error('No template selected for deletion');
      alert('No template selected for deletion');
      setIsDeleteTemplateDialogOpen(false);
      return;
    }
    
    if (!templateToDelete.id) {
      console.error('Template is missing ID:', templateToDelete);
      alert('Cannot delete template: Missing ID');
      setIsDeleteTemplateDialogOpen(false);
      return;
    }
    
    // Check if user has permission to delete templates
    if (user?.role !== 'admin' && !templateToDelete.isCustom) {
      console.error('Permission denied: Only admin users can delete system templates');
      alert('You do not have permission to delete this template. Only custom templates can be deleted by regular users.');
      setIsDeleteTemplateDialogOpen(false);
      return;
    }
    
    console.log('Attempting to delete template with ID:', templateToDelete.id, 'Name:', templateToDelete.name);
    setIsLoadingAction(true);
    
    try {
      // For built-in templates (IDs 1-10), we need admin permissions
      if (Number(templateToDelete.id) <= 10 && user?.role !== 'admin') {
        throw new Error('Permission denied: Cannot delete built-in templates');
      }
      
      // Ensure the ID is a string
      const templateId = String(templateToDelete.id).trim();
      if (!templateId) {
        throw new Error('Invalid template ID');
      }
      
      const result = await templateApi.delete(templateId);
      console.log('Template deletion result:', result);
      
      // Update the templates list by filtering out the deleted template
      setTemplates(templates.filter(t => t.id !== templateToDelete.id));
      setIsDeleteTemplateDialogOpen(false);
      
      // Show success message
      alert(`Template "${templateToDelete.name}" deleted successfully`);
      
      // Refresh the templates list to ensure it's up to date
      fetchUserTemplates();
    } catch (err) {
      console.error('Failed to delete template:', err);
      
      // Provide specific error message based on the error
      if (err instanceof Error && err.message.includes('Permission denied')) {
        alert('Permission denied: You cannot delete built-in templates.');
      } else if (err instanceof Error && err.message.includes('404')) {
        alert('Template not found. It may have been already deleted.');
      } else if (err instanceof Error && err.message.includes('Invalid template ID')) {
        alert('Invalid template ID. Please try again.');
      } else {
        alert('Failed to delete template. Please try again later.');
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleEditTemplate = (template: Template) => {
    if (!template.id) {
      console.error('No template ID provided for editing');
      return;
    }
    
    // Check if user has permission to edit this template
    if (user?.role !== 'admin' && !template.isCustom) {
      console.error('Permission denied: Only admin users can edit system templates');
      alert('You do not have permission to edit this template. Only custom templates can be edited by regular users.');
      return;
    }
    
    // For built-in templates (IDs 1-10), we need admin permissions
    if (Number(template.id) <= 10 && user?.role !== 'admin') {
      alert('Permission denied: You cannot edit built-in templates.');
      return;
    }
    
    console.log('Editing template with ID:', template.id);
    
    // Navigate to editor with template ID as a parameter
    navigate(`/editor?templateId=${template.id}`);
  };

  const handleEditPortfolio = (portfolio: Portfolio) => {
    // Validate portfolio exists and has an ID
    if (!portfolio) {
      console.error('No portfolio provided for editing');
      alert('Cannot edit portfolio: Missing portfolio data');
      return;
    }

    // Check all possible ID fields
    const portfolioId = portfolio._id || portfolio.id;
    
    if (!portfolioId) {
      console.error('No portfolio ID found in portfolio object:', portfolio);
      alert('Cannot edit portfolio: Missing ID');
      return;
    }
    
    // Log the full portfolio object for debugging
    console.log('Full portfolio object being edited:', JSON.stringify(portfolio));
    console.log('Editing portfolio with ID:', portfolioId, 'Title:', portfolio.title);
    
    // Store the portfolio data in localStorage for backup
    try {
      localStorage.setItem('editingPortfolioData', JSON.stringify(portfolio));
      console.log('Saved portfolio data to localStorage for backup');
    } catch (error) {
      console.error('Failed to save portfolio data to localStorage:', error);
    }
    
    // Navigate to editor with the ID as a query parameter
    navigate(`/editor?id=${portfolioId}`);
  };

  const handleDeletePortfolio = async () => {
    // Validate portfolio exists and has an ID
    if (!portfolioToDelete) {
      console.error('No portfolio selected for deletion');
      alert('No portfolio selected for deletion');
      setIsDeleteDialogOpen(false);
      return;
    }
    
    // Check for either id or _id (MongoDB style)
    const portfolioId = portfolioToDelete.id || portfolioToDelete._id;
    
    if (!portfolioId) {
      console.error('Portfolio is missing ID:', portfolioToDelete);
      alert('Cannot delete portfolio: Missing ID');
      setIsDeleteDialogOpen(false);
      return;
    }
    
    console.log('Attempting to delete portfolio with ID:', portfolioId, 'Title:', portfolioToDelete.title);
    setIsLoadingAction(true);
    
    try {
      // Ensure the ID is a string and valid
      const idToDelete = String(portfolioId).trim();
      if (!idToDelete) {
        throw new Error('Invalid portfolio ID');
      }
      
      // Log the exact ID being sent to the API
      console.log('Sending delete request with exact ID:', idToDelete, 'Type:', typeof idToDelete);
      
      // Call the API to delete the portfolio
      const result = await portfolioApi.delete(idToDelete);
      console.log('Portfolio deletion result:', result);
      
      // Update the portfolios list by filtering out the deleted portfolio
      setPortfolios(portfolios.filter(p => {
        // Get the ID from either id or _id field
        const pId = p.id || p._id;
        // Handle both string and number IDs for comparison
        return String(pId) !== String(portfolioId);
      }));
      
      setIsDeleteDialogOpen(false);
      
      // Show success message
      alert(`Portfolio "${portfolioToDelete.title}" deleted successfully`);
      
      // Refresh the portfolios list to ensure it's up to date
      fetchPortfolios();
    } catch (err) {
      console.error('Failed to delete portfolio:', err);
      
      // Provide specific error message based on the error
      if (err instanceof Error && err.message.includes('404')) {
        alert('Portfolio not found. It may have been already deleted.');
      } else if (err instanceof Error && err.message.includes('Invalid portfolio ID')) {
        alert('Invalid portfolio ID. Please try again.');
      } else {
        alert('Failed to delete portfolio. Please try again later.');
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleViewPortfolio = (portfolio: Portfolio) => {
    if (!portfolio.id) return;
    navigate(`/portfolio/${portfolio.id}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create New Portfolio
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Left sidebar with stats */}
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
              <Card elevation={2}>
                <CardHeader 
                  title={`Welcome, ${user?.name}`}
                  subheader={`You have ${portfolios.length} portfolios`}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'primary.light' }}>
                      <Typography variant="h6" color="primary.contrastText">
                        Total Portfolios
                      </Typography>
                      <Typography variant="h4" color="primary.contrastText">
                        {portfolios.length}
                      </Typography>
                    </Paper>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'success.light' }}>
                      <Typography variant="h6" color="success.contrastText">
                        Published
                      </Typography>
                      <Typography variant="h4" color="success.contrastText">
                        {portfolios.filter(p => p.isPublished).length}
                      </Typography>
                    </Paper>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'warning.light' }}>
                      <Typography variant="h6" color="warning.contrastText">
                        Drafts
                      </Typography>
                      <Typography variant="h4" color="warning.contrastText">
                        {portfolios.filter(p => !p.isPublished).length}
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Main content with portfolio list */}
            <Box sx={{ width: '100%' }}>
              <Card>
                <CardHeader
                  title={activeTab === 'portfolios' ? 'Portfolios' : 'Templates'}
                  subheader={activeTab === 'portfolios' ? 'Your created portfolios' : 'Your custom templates'}
                  action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant={activeTab === 'portfolios' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('portfolios')}
                        size="small"
                      >
                        Portfolios
                      </Button>
                      <Button 
                        variant={activeTab === 'templates' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('templates')}
                        size="small"
                      >
                        Templates
                      </Button>
                    </Box>
                  }
                />
                <CardContent>
                  {activeTab === 'portfolios' && (
                    <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                      <Button 
                        variant={filterStatus === 'all' ? 'contained' : 'outlined'}
                        onClick={() => setFilterStatus('all')}
                        size="small"
                        color="primary"
                      >
                        All ({portfolios.length})
                      </Button>
                      <Button 
                        variant={filterStatus === 'published' ? 'contained' : 'outlined'}
                        onClick={() => setFilterStatus('published')}
                        size="small"
                        color="success"
                      >
                        Published ({portfolios.filter(p => p.isPublished).length})
                      </Button>
                      <Button 
                        variant={filterStatus === 'draft' ? 'contained' : 'outlined'}
                        onClick={() => setFilterStatus('draft')}
                        size="small"
                        color="warning"
                      >
                        Drafts ({portfolios.filter(p => !p.isPublished).length})
                      </Button>
                    </Box>
                  )}
                  
                  {isLoading || isLoadingTemplates ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <CircularProgress />
                    </Box>
                  ) : activeTab === 'portfolios' && filteredPortfolios.length > 0 ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                      {filteredPortfolios.map((portfolio, index) => (
                        <Box key={index}>
                          <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardHeader
                              title={portfolio.title}
                              subheader={formatDate(portfolio.updatedAt ?? '')}
                              action={
                                <Chip
                                  label={portfolio.isPublished ? 'Published' : 'Draft'}
                                  color={portfolio.isPublished ? 'success' : 'warning'}
                                  size="small"
                                />
                              }
                            />
                            <CardMedia
                              component="img"
                              height="140"
                              image={portfolio.thumbnail || '/default-portfolio-thumbnail.png'}
                              alt={portfolio.title}
                            />
                            <CardContent>
                              <Typography variant="body2" color="text.secondary">
                                {portfolio.description}
                              </Typography>
                              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={`Visits: ${portfolio.visits || 0}`}
                                  size="small"
                                  color="primary"
                                />
                                <Chip
                                  label={portfolio.template ? 'Custom Template' : 'Default Template'}
                                  size="small"
                                  color="info"
                                />
                              </Box>
                            </CardContent>
                            <CardActions>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  console.log('Edit portfolio clicked:', portfolio);
                                  handleEditPortfolio(portfolio);
                                }}
                                startIcon={<EditIcon />}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  // Check for either id or _id (MongoDB style)
                                  const portfolioId = portfolio.id || portfolio._id;
                                  
                                  if (!portfolioId) {
                                    console.error('Portfolio missing ID:', portfolio);
                                    alert('Cannot delete portfolio: This portfolio does not have a valid ID');
                                    return;
                                  }
                                  
                                  // Create a copy with a guaranteed ID field
                                  const portfolioWithId = {
                                    ...portfolio,
                                    id: String(portfolioId) // Ensure ID is a string
                                  };
                                  
                                  console.log('Setting portfolio to delete:', portfolioWithId);
                                  setPortfolioToDelete(portfolioWithId);
                                  setIsDeleteDialogOpen(true);
                                }}
                                startIcon={<DeleteIcon />}
                              >
                                Delete
                              </Button>
                              {portfolio.isPublished && (
                                <Button
                                  variant="outlined"
                                  color="success"
                                  onClick={() => handleViewPortfolio(portfolio)}
                                  startIcon={<VisibilityIcon />}
                                >
                                  View
                                </Button>
                              )}
                            </CardActions>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  ) : activeTab === 'templates' && filteredTemplates.length > 0 ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                      {filteredTemplates.map((template, index) => (
                        <Box key={index}>
                          <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardHeader
                              title={template.name}
                              subheader={template.category}
                            />
                            <CardMedia
                              component="img"
                              height="140"
                              image={template.thumbnail}
                              alt={template.name}
                            />
                            <CardContent>
                              <Typography variant="body2" color="text.secondary">
                                {template.description}
                              </Typography>
                              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {template.tags.map((tag: string, idx: number) => (
                                  <Chip
                                    key={idx}
                                    label={tag}
                                    size="small"
                                    sx={{ bgcolor: 'primary.light', color: 'primary.main' }}
                                  />
                                ))}
                              </Box>
                            </CardContent>
                            <CardActions>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  console.log('Edit template clicked:', template);
                                  handleEditTemplate(template);
                                }}
                                startIcon={<EditIcon />}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  console.log('Setting template to delete:', template);
                                  setTemplateToDelete(template);
                                  setIsDeleteTemplateDialogOpen(true);
                                }}
                                startIcon={<DeleteIcon />}
                              >
                                Delete
                              </Button>
                            </CardActions>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 6,
                      width: '100%'
                    }}>
                      <Typography color="text.secondary">
                        {activeTab === 'portfolios' ? 'No portfolios found' : 'No custom templates found'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Create Portfolio Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Create a new portfolio from scratch.
          </DialogContentText>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Portfolio Name"
              fullWidth
              placeholder="My Amazing Portfolio"
              value={newPortfolioName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPortfolioName(e.target.value)}
            />
            <TextField
              label="Description (Optional)"
              fullWidth
              placeholder="A showcase of my work and skills"
              value={newPortfolioDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPortfolioDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePortfolio}
            disabled={!newPortfolioName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog
        open={isDeleteTemplateDialogOpen}
        onClose={() => setIsDeleteTemplateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this template?
          </DialogContentText>
          
          {/* Template details outside of DialogContentText to avoid DOM nesting issues */}
          {templateToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle2">Template Details:</Typography>
              <Typography variant="body2">ID: {templateToDelete.id}</Typography>
              <Typography variant="body2">Name: {templateToDelete.name}</Typography>
              <Typography variant="body2">Custom: {templateToDelete.isCustom ? 'Yes' : 'No'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteTemplateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              console.log('Delete button clicked');
              console.log('Template to delete:', templateToDelete);
              handleDeleteTemplate();
            }}
            color="error"
            variant="contained"
            disabled={isLoadingAction}
          >
            {isLoadingAction ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Portfolio Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the portfolio "{portfolioToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
          
          {/* Portfolio details outside of DialogContentText to avoid DOM nesting issues */}
          {portfolioToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle2">Portfolio Details:</Typography>
              <Typography variant="body2">ID: {portfolioToDelete.id || portfolioToDelete._id}</Typography>
              <Typography variant="body2">Status: {portfolioToDelete.isPublished ? 'Published' : 'Draft'}</Typography>
              <Typography variant="body2">Last Updated: {portfolioToDelete.updatedAt ? formatDate(portfolioToDelete.updatedAt) : 'N/A'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              console.log('Delete portfolio button clicked');
              console.log('Portfolio to delete:', portfolioToDelete);
              handleDeletePortfolio();
            }}
            color="error"
            variant="contained"
            disabled={isLoadingAction}
          >
            {isLoadingAction ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Dashboard;