import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Tooltip
} from "@mui/material";
import { 
  Dashboard as DashboardIcon, 
  Person as PersonIcon, 
  Logout as LogoutIcon, 
  Menu as MenuIcon,
  Home as HomeIcon,
  ViewQuilt as TemplatesIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon
} from "@mui/icons-material";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getInitials = () => {
    if (!user) return "U";
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return "U";
  };

  // We want the navbar to show on all pages, including the editor page
  // Previously, the navbar was hidden on editor pages with this code:
  // const isEditorPage = location.startsWith("/editor");
  // if (isEditorPage) return null;

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 3,
          mt: 1.5,
          minWidth: 220,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      }}
    >
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {user?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {user?.email}
        </Typography>
      </Box>
      <Divider sx={{ mx: 2 }} />
      <MenuItem 
        onClick={() => { navigate('/dashboard'); handleMenuClose(); }}
        sx={{
          mx: 1,
          my: 0.5,
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'rgba(102, 126, 234, 0.1)',
            color: '#667eea'
          }
        }}
      >
        <ListItemIcon>
          <DashboardIcon fontSize="small" sx={{ color: 'inherit' }} />
        </ListItemIcon>
        Dashboard
      </MenuItem>
      <MenuItem 
        onClick={() => { navigate('/settings'); handleMenuClose(); }}
        sx={{
          mx: 1,
          my: 0.5,
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'rgba(102, 126, 234, 0.1)',
            color: '#667eea'
          }
        }}
      >
        <ListItemIcon>
          <SettingsIcon fontSize="small" sx={{ color: 'inherit' }} />
        </ListItemIcon>
        Settings
      </MenuItem>
      <Divider sx={{ mx: 2, my: 1 }} />
      <MenuItem 
        onClick={handleLogout}
        sx={{
          mx: 1,
          my: 0.5,
          borderRadius: 2,
          color: 'error.main',
          '&:hover': {
            bgcolor: 'rgba(211, 47, 47, 0.1)'
          }
        }}
      >
        <ListItemIcon>
          <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
        </ListItemIcon>
        Log out
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          🚀 DragFolio
        </Typography>
        {isAuthenticated && user && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Welcome back,
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
          </Box>
        )}
      </Box>
      
      <List sx={{ pt: 2 }}>
        <ListItem 
          onClick={() => { navigate('/'); handleDrawerToggle(); }}
          sx={{ 
            mx: 2, 
            mb: 1, 
            borderRadius: 2,
            backgroundColor: location === '/' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
          }}
        >
          <ListItemIcon>
            <HomeIcon sx={{ color: location === '/' ? '#667eea' : 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Home" 
            sx={{ 
              '& .MuiListItemText-primary': { 
                fontWeight: location === '/' ? 600 : 400,
                color: location === '/' ? '#667eea' : 'text.primary'
              }
            }} 
          />
        </ListItem>
        
        <ListItem 
          onClick={() => { navigate('/templates'); handleDrawerToggle(); }}
          sx={{ 
            mx: 2, 
            mb: 1, 
            borderRadius: 2,
            backgroundColor: location === '/templates' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
          }}
        >
          <ListItemIcon>
            <TemplatesIcon sx={{ color: location === '/templates' ? '#667eea' : 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Templates" 
            sx={{ 
              '& .MuiListItemText-primary': { 
                fontWeight: location === '/templates' ? 600 : 400,
                color: location === '/templates' ? '#667eea' : 'text.primary'
              }
            }} 
          />
        </ListItem>
        
        {isAuthenticated && (
          <>
            <Divider sx={{ mx: 2, my: 2 }} />
            <ListItem 
              onClick={() => { navigate('/dashboard'); handleDrawerToggle(); }}
              sx={{ 
                mx: 2, 
                mb: 1, 
                borderRadius: 2,
                backgroundColor: location === '/dashboard' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
              }}
            >
              <ListItemIcon>
                <DashboardIcon sx={{ color: location === '/dashboard' ? '#667eea' : 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontWeight: location === '/dashboard' ? 600 : 400,
                    color: location === '/dashboard' ? '#667eea' : 'text.primary'
                  }
                }} 
              />
            </ListItem>
            
            <ListItem 
              onClick={() => { navigate('/settings'); handleDrawerToggle(); }}
              sx={{ 
                mx: 2, 
                mb: 1, 
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
              }}
            >
              <ListItemIcon>
                <SettingsIcon sx={{ color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            
            <Divider sx={{ mx: 2, my: 2 }} />
            <ListItem 
              onClick={() => { handleLogout(); handleDrawerToggle(); }}
              sx={{ 
                mx: 2, 
                mb: 1, 
                borderRadius: 2,
                color: 'error.main',
                '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' }
              }}
            >
              <ListItemIcon>
                <LogoutIcon sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItem>
          </>
        )}
        
        {!isAuthenticated && (
          <>
            <Divider sx={{ mx: 2, my: 2 }} />
            <Box sx={{ px: 2, py: 1 }}>
              <Button 
                fullWidth 
                variant="outlined"
                onClick={() => { navigate('/register'); handleDrawerToggle(); }}
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Sign Up
              </Button>
              <Button 
                fullWidth 
                variant="contained"
                onClick={() => { navigate('/login'); handleDrawerToggle(); }}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Log In
              </Button>
            </Box>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  filter: 'brightness(1.2)'
                }
              }}
            >
              🚀 DragFolio
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                <Button
                  onClick={() => navigate('/')}
                  startIcon={<HomeIcon />}
                  sx={{ 
                    my: 1, 
                    mx: 1,
                    px: 3,
                    py: 1,
                    color: location === '/' ? '#667eea' : 'text.primary', 
                    fontWeight: location === '/' ? 600 : 500,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateY(-2px)',
                      color: '#667eea'
                    }
                  }}
                >
                  Home
                </Button>
                <Button
                  onClick={() => navigate('/templates')}
                  startIcon={<TemplatesIcon />}
                  sx={{ 
                    my: 1, 
                    mx: 1,
                    px: 3,
                    py: 1,
                    color: location === '/templates' ? '#667eea' : 'text.primary',
                    fontWeight: location === '/templates' ? 600 : 500,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateY(-2px)',
                      color: '#667eea'
                    }
                  }}
                >
                  Templates
                </Button>
                {isAuthenticated && (
                  <Button
                    onClick={() => navigate('/dashboard')}
                    startIcon={<DashboardIcon />}
                    sx={{ 
                      my: 1, 
                      mx: 1,
                      px: 3,
                      py: 1,
                      color: location === '/dashboard' ? '#667eea' : 'text.primary',
                      fontWeight: location === '/dashboard' ? 600 : 500,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateY(-2px)',
                        color: '#667eea'
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                )}
              </Box>
            )}

            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Profile Menu" arrow>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      ) : (
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                          {getInitials()}
                        </Typography>
                      )}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#667eea',
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLogin}
                  startIcon={<PersonIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  Log In
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileMenuOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>

      {renderMenu}
    </>
  );
}
