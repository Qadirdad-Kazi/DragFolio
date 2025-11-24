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
  Chip,
  Fade,
  Zoom,
  Avatar,
  IconButton,
  Tooltip,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AutoAwesome as SparklesIcon,
  TrendingUp as TrendingUpIcon,
  Rocket as RocketIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { portfolioApi, templateApi } from '../services/api';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
`;

// Styled components for enhanced UI
const DashboardContainer = styled(Box)(({ theme }) => ({
  background: '#f8fafc', // Clean, modern light background
  minHeight: '100vh',
  position: 'relative',
}));

const WelcomeCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '32px',
  marginBottom: '32px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  overflow: 'hidden',
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const PortfolioCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
  },
}));

const CreateButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  borderRadius: '16px',
  padding: '16px 32px',
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  color: 'white',
  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(45deg, #5a6fd8, #6b42a0)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
  },
}));

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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

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

  const filteredPortfolios = portfolios
    .filter(portfolio => {
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
    })
    .filter(portfolio => {
      if (!searchQuery) return true;
      return portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        portfolio.description?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
      } else if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const filteredTemplates = templates
    .filter(() => activeTab === 'templates')
    .filter(template => {
      if (!searchQuery) return true;
      return template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        // Templates might not have updatedAt, fallback to createdAt or 0
        return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.updatedAt || a.createdAt || 0).getTime() - new Date(b.updatedAt || b.createdAt || 0).getTime();
      } else if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

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
      <DashboardContainer>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
              Manage your portfolios and templates from one place.
            </Typography>
          </Box>

          {/* Stats Row */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    mr: 2
                  }}>
                    <RocketIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {portfolios.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Total Portfolios
                    </Typography>
                  </Box>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    mr: 2
                  }}>
                    <VisibilityIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {portfolios.filter(p => p.isPublished).length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Published
                    </Typography>
                  </Box>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    mr: 2
                  }}>
                    <EditIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {portfolios.filter(p => !p.isPublished).length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Drafts
                    </Typography>
                  </Box>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: 'rgba(236, 72, 153, 0.1)',
                    color: '#ec4899',
                    mr: 2
                  }}>
                    <SparklesIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {templates.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Templates
                    </Typography>
                  </Box>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>

          {/* Controls & Content */}
          <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={activeTab === 'portfolios' ? 'contained' : 'text'}
                onClick={() => setActiveTab('portfolios')}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  bgcolor: activeTab === 'portfolios' ? '#667eea' : 'transparent',
                  color: activeTab === 'portfolios' ? 'white' : '#64748b',
                  '&:hover': {
                    bgcolor: activeTab === 'portfolios' ? '#5a6fd8' : 'rgba(100, 116, 139, 0.1)',
                  }
                }}
              >
                My Portfolios
              </Button>
              <Button
                variant={activeTab === 'templates' ? 'contained' : 'text'}
                onClick={() => setActiveTab('templates')}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  bgcolor: activeTab === 'templates' ? '#667eea' : 'transparent',
                  color: activeTab === 'templates' ? 'white' : '#64748b',
                  '&:hover': {
                    bgcolor: activeTab === 'templates' ? '#5a6fd8' : 'rgba(100, 116, 139, 0.1)',
                  }
                }}
              >
                My Templates
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: '100%', md: '250px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: 'white',
                    '& fieldset': { borderColor: '#e2e8f0' },
                  }
                }}
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  displayEmpty
                  sx={{
                    borderRadius: '12px',
                    bgcolor: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="alphabetical">A-Z</MenuItem>
                </Select>
              </FormControl>

              <CreateButton
                startIcon={<AddIcon />}
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Create New
              </CreateButton>
            </Box>
          </Box>

          {/* Content Grid */}
          <Box>
            {activeTab === 'portfolios' && (
              <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                <Chip
                  label={`All (${portfolios.length})`}
                  onClick={() => setFilterStatus('all')}
                  color={filterStatus === 'all' ? 'primary' : 'default'}
                  variant={filterStatus === 'all' ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`Published (${portfolios.filter(p => p.isPublished).length})`}
                  onClick={() => setFilterStatus('published')}
                  color={filterStatus === 'published' ? 'success' : 'default'}
                  variant={filterStatus === 'published' ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`Drafts (${portfolios.filter(p => !p.isPublished).length})`}
                  onClick={() => setFilterStatus('draft')}
                  color={filterStatus === 'draft' ? 'warning' : 'default'}
                  variant={filterStatus === 'draft' ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            )}

            {isLoading || isLoadingTemplates ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#667eea' }} />
              </Box>
            ) : activeTab === 'portfolios' && filteredPortfolios.length > 0 ? (
              <Grid container spacing={3}>
                {filteredPortfolios.map((portfolio, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                    <PortfolioCard>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={portfolio.thumbnail || '/default-portfolio-thumbnail.png'}
                          alt={portfolio.title}
                          sx={{ filter: portfolio.isPublished ? 'none' : 'grayscale(20%)' }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          display: 'flex',
                          gap: 1
                        }}>
                          <Chip
                            label={portfolio.isPublished ? 'Published' : 'Draft'}
                            color={portfolio.isPublished ? 'success' : 'warning'}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backdropFilter: 'blur(4px)',
                              bgcolor: portfolio.isPublished ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                              color: 'white'
                            }}
                          />
                        </Box>
                      </Box>
                      <CardContent sx={{ pt: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }} noWrap>
                          {portfolio.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {portfolio.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                            Updated {formatDate(portfolio.updatedAt ?? '')}
                          </Typography>
                          <Box>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditPortfolio(portfolio)}
                                sx={{ color: '#667eea', bgcolor: 'rgba(102, 126, 234, 0.1)', mr: 1, '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' } }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const portfolioId = portfolio.id || portfolio._id;
                                  if (!portfolioId) return;
                                  setPortfolioToDelete({ ...portfolio, id: String(portfolioId) });
                                  setIsDeleteDialogOpen(true);
                                }}
                                sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                      {portfolio.isPublished && (
                        <Box sx={{ px: 2, pb: 2 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handleViewPortfolio(portfolio)}
                            startIcon={<VisibilityIcon />}
                            sx={{
                              borderRadius: '10px',
                              borderColor: '#e2e8f0',
                              color: '#64748b',
                              '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' }
                            }}
                          >
                            View Live Site
                          </Button>
                        </Box>
                      )}
                    </PortfolioCard>
                  </Grid>
                ))}
              </Grid>
            ) : activeTab === 'templates' && filteredTemplates.length > 0 ? (
              <Grid container spacing={3}>
                {filteredTemplates.map((template, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                    <PortfolioCard>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={template.thumbnail}
                          alt={template.name}
                        />
                        <Box sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12
                        }}>
                          <Chip
                            label={template.category}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backdropFilter: 'blur(4px)',
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                              color: '#1e293b'
                            }}
                          />
                        </Box>
                      </Box>
                      <CardContent sx={{ pt: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }} noWrap>
                          {template.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {template.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {template.tags.slice(0, 2).map((tag, idx) => (
                              <Chip key={idx} label={tag} size="small" sx={{ fontSize: '0.7rem', height: '20px' }} />
                            ))}
                          </Box>
                          <Box>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditTemplate(template)}
                                sx={{ color: '#667eea', bgcolor: 'rgba(102, 126, 234, 0.1)', mr: 1, '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' } }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setTemplateToDelete(template);
                                  setIsDeleteTemplateDialogOpen(true);
                                }}
                                sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </PortfolioCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{
                textAlign: 'center',
                py: 10,
                bgcolor: 'white',
                borderRadius: '24px',
                border: '1px dashed #e2e8f0'
              }}>
                <Box sx={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  bgcolor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <RocketIcon sx={{ fontSize: 40, color: '#94a3b8' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  {activeTab === 'portfolios' ? 'No portfolios found' : 'No templates found'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '400px', mx: 'auto', mb: 4 }}>
                  {activeTab === 'portfolios'
                    ? "You haven't created any portfolios yet. Click the button below to get started!"
                    : "You haven't created any custom templates yet."}
                </Typography>
                {activeTab === 'portfolios' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreateDialogOpen(true)}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    }}
                  >
                    Create Your First Portfolio
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </DashboardContainer>

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