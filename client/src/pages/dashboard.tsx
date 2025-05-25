import { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import { useLocation } from 'wouter';
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
  Grid,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { portfolioApi, templateApi } from '../services/api';
import { Portfolio as PortfolioType } from '../types';

// Define a runtime type that ensures required fields for UI display
interface Portfolio extends PortfolioType {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  template: string;
  updatedAt: string;
  visits: number;
}

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const [_, navigate] = useLocation();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [newPortfolioTemplate, setNewPortfolioTemplate] = useState('blank');
  const [error, setError] = useState<string | null>(null);
  const [templateOptions, setTemplateOptions] = useState<{value: string, label: string}[]>([]);

  // Fetch portfolios when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolios();
      fetchTemplates();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch user's portfolios
  const fetchPortfolios = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await portfolioApi.getAll();
      setPortfolios(data);
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
      setError('Failed to load your portfolios. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch available templates
  const fetchTemplates = async () => {
    try {
      const data = await templateApi.getAll();
      const options = [{ value: 'blank', label: 'Blank Canvas' }];
      
      data.forEach((template: any) => {
        if (template.isPublished) {
          options.push({
            value: template.id,
            label: template.name
          });
        }
      });
      
      setTemplateOptions(options);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Filter portfolios based on active tab
  const filteredPortfolios = portfolios.filter(portfolio => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return portfolio.isPublished;
    if (activeTab === 'drafts') return !portfolio.isPublished;
    return true;
  });

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle create portfolio
  const handleCreatePortfolio = async () => {
    if (!newPortfolioName.trim()) return;
    
    setIsLoadingAction(true);
    setError(null);
    
    try {
      const newPortfolio = await portfolioApi.create({
        title: newPortfolioName,
        description: newPortfolioDescription || '',
        template: newPortfolioTemplate,
        isPublished: false,
        // Add required fields based on server validation schema
        sections: [],
        theme: {
          mode: 'light',
          primaryColor: '#3490dc',
          secondaryColor: '#ffed4a',
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px'
        },
        userId: user?.id || 'temp-user-id' // Use the logged-in user ID or a temporary one
      });
      
      setPortfolios([newPortfolio, ...portfolios]);
      setIsCreateDialogOpen(false);
      setNewPortfolioName('');
      setNewPortfolioDescription('');
      setNewPortfolioTemplate('blank');
      
      // Navigate to editor with the new portfolio ID
      navigate(`/editor?id=${newPortfolio.id}`);
    } catch (err) {
      console.error('Failed to create portfolio:', err);
      setError('Failed to create portfolio. Please try again.');
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Handle delete portfolio
  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete || !portfolioToDelete.id) {
      console.error('No valid portfolio provided for deletion');
      setError('Cannot delete portfolio: Invalid portfolio data');
      return;
    }
    
    setIsLoadingAction(true);
    setError(null);
    
    try {
      console.log('Deleting portfolio with ID:', portfolioToDelete.id);
      
      // Use the API service to delete the portfolio
      await portfolioApi.delete(portfolioToDelete.id);
      
      // Update the local state to remove the deleted portfolio
      setPortfolios(portfolios.filter(p => p.id !== portfolioToDelete.id));
      setIsDeleteDialogOpen(false);
      setPortfolioToDelete(null);
      
      // Show success message
      setError(null);
    } catch (err) {
      console.error('Failed to delete portfolio:', err);
      setError('Failed to delete portfolio. Please try again.');
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Handle edit portfolio
  const handleEditPortfolio = (portfolioId: string | undefined) => {
    if (!portfolioId) {
      console.error('No portfolio ID provided for editing');
      setError('Cannot edit portfolio: No ID provided');
      return;
    }
    console.log('Navigating to editor with portfolio ID:', portfolioId);
    navigate(`/editor?id=${portfolioId}`);
  };

  // Handle view portfolio
  const handleViewPortfolio = (portfolio: Portfolio) => {
    if (!portfolio || !portfolio.id) {
      console.error('No valid portfolio provided for viewing');
      setError('Cannot view portfolio: Invalid portfolio data');
      return;
    }
    
    console.log('Viewing portfolio:', portfolio.id, portfolio.isPublished);
    
    if (portfolio.isPublished && portfolio.subdomain) {
      // For published portfolios with a subdomain, open in a new tab
      window.open(`https://${portfolio.subdomain}.dragfolio.io`, '_blank');
    } else {
      // For drafts, navigate to the preview page
      console.log('Navigating to preview with portfolio ID:', portfolio.id);
      navigate(`/preview?id=${portfolio.id}`);
    }
  };

  return (
    <>
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 4
        }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your portfolios and templates
            </Typography>
          </Box>
          
          <Button 
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{ mt: { xs: 2, md: 0 } }}
          >
            Create Portfolio
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {/* Left sidebar with stats */}
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
            <Card elevation={2}>
              <CardHeader 
                title={`Welcome, ${user?.name}`}
                subheader="Here's an overview of your portfolios"
              />
              <CardContent>
                <Stack spacing={2}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="h6">{portfolios.length}</Typography>
                    <Typography variant="body2">Total Portfolios</Typography>
                  </Paper>
                  
                  <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="h6">
                      {portfolios.filter(p => p.isPublished).length}
                    </Typography>
                    <Typography variant="body2">Published</Typography>
                  </Paper>
                  
                  <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <Typography variant="h6">
                      {portfolios.filter(p => !p.isPublished).length}
                    </Typography>
                    <Typography variant="body2">Drafts</Typography>
                  </Paper>
                  
                  <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <Typography variant="h6">
                      {portfolios.reduce((total, p) => total + (p.visits || 0), 0)}
                    </Typography>
                    <Typography variant="body2">Total Visits</Typography>
                  </Paper>
                </Stack>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate('/templates')}
                >
                  Browse Templates
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Main content with portfolio list */}
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
            <Card elevation={2}>
              <CardHeader 
                title="Your Portfolios"
                action={
                  <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab value="all" label="All" />
                    <Tab value="published" label="Published" />
                    <Tab value="drafts" label="Drafts" />
                  </Tabs>
                }
              />
              <CardContent>
                {isLoading ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CircularProgress size={48} sx={{ mb: 2 }} />
                    <Typography color="text.secondary">Loading your portfolios...</Typography>
                  </Box>
                ) : error ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                    <Button variant="contained" onClick={fetchPortfolios}>Try Again</Button>
                  </Box>
                ) : filteredPortfolios.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>No portfolios found</Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      Create Your First Portfolio
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {filteredPortfolios.map(portfolio => (
                      <Paper 
                        key={portfolio.id} 
                        elevation={1}
                        sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          overflow: 'hidden',
                          transition: 'box-shadow 0.3s',
                          '&:hover': { boxShadow: 3 }
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: { xs: '100%', sm: '25%' }, 
                            height: { xs: 160, sm: 'auto' },
                            bgcolor: 'grey.100'
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={portfolio.thumbnail ? portfolio.thumbnail : 'https://via.placeholder.com/300x200?text=Portfolio'}
                            alt={portfolio.title}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1, p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="h6">{portfolio.title}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {portfolio.description}
                              </Typography>
                            </Box>
                            <Chip 
                              label={portfolio.isPublished ? 'Published' : 'Draft'}
                              color={portfolio.isPublished ? 'success' : 'warning'}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Template: {portfolio.template}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">•</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Last updated: {portfolio.updatedAt ? formatDate(portfolio.updatedAt) : 'N/A'}
                            </Typography>
                            {portfolio.isPublished && (
                              <>
                                <Typography variant="caption" color="text.secondary">•</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Visits: {portfolio.visits}
                                </Typography>
                              </>
                            )}
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Button 
                              size="small" 
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => handleEditPortfolio(portfolio.id)}
                            >
                              Edit
                            </Button>
                            
                            <Button 
                              size="small" 
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewPortfolio(portfolio)}
                            >
                              {portfolio.isPublished ? 'Visit' : 'Preview'}
                            </Button>
                            
                            {portfolio.isPublished && (
                              <Button 
                                size="small" 
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                              >
                                Export
                              </Button>
                            )}
                            
                            <Button 
                              size="small" 
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                setPortfolioToDelete(portfolio);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
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
            Create a new portfolio from scratch or using a template.
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
            
            <FormControl fullWidth>
              <InputLabel id="template-select-label">Template</InputLabel>
              {templateOptions.length > 0 ? (
                <Select
                  labelId="template-select-label"
                  value={newPortfolioTemplate}
                  onChange={(e) => setNewPortfolioTemplate(e.target.value as string)}
                  label="Template"
                >
                  {templateOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Grid container spacing={2}>
                  <Grid sx={{ gridColumn: 'span 6' }}>
                    <Paper 
                      sx={{
                        p: 2, 
                        cursor: 'pointer',
                        border: newPortfolioTemplate === 'blank' ? '1px solid' : 'none',
                        borderColor: 'primary.main',
                        bgcolor: newPortfolioTemplate === 'blank' ? 'primary.light' : 'background.paper'
                      }}
                      onClick={() => setNewPortfolioTemplate('blank')}
                      elevation={newPortfolioTemplate === 'blank' ? 3 : 1}
                    >
                      <Typography variant="subtitle1">Blank Canvas</Typography>
                      <Typography variant="body2" color="text.secondary">Start from scratch</Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid sx={{ gridColumn: 'span 6' }}>
                    <Paper 
                      sx={{
                        p: 2, 
                        cursor: 'pointer',
                        border: newPortfolioTemplate === 'developer' ? '1px solid' : 'none',
                        borderColor: 'primary.main',
                        bgcolor: newPortfolioTemplate === 'developer' ? 'primary.light' : 'background.paper'
                      }}
                      onClick={() => setNewPortfolioTemplate('developer')}
                      elevation={newPortfolioTemplate === 'developer' ? 3 : 1}
                    >
                      <Typography variant="subtitle1">Developer</Typography>
                      <Typography variant="body2" color="text.secondary">For showcasing code projects</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="outlined" 
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreatePortfolio} 
            disabled={!newPortfolioName.trim() || isLoadingAction}
            startIcon={isLoadingAction ? <CircularProgress size={16} /> : null}
          >
            {isLoadingAction ? 'Creating...' : 'Create Portfolio'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this portfolio? This action cannot be undone.
          </DialogContentText>
          
          {portfolioToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">{portfolioToDelete.title}</Typography>
              <Typography variant="body2" color="text.secondary">{portfolioToDelete.description}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="outlined" 
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeletePortfolio}
            disabled={isLoadingAction}
            startIcon={isLoadingAction ? <CircularProgress size={16} /> : null}
          >
            {isLoadingAction ? 'Deleting...' : 'Delete Portfolio'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
