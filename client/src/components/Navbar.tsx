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
  ListItemText
} from "@mui/material";
import { 
  Dashboard as DashboardIcon, 
  Person as PersonIcon, 
  Logout as LogoutIcon, 
  Menu as MenuIcon,
  Home as HomeIcon
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

  // Check if we're on the editor page
  const isEditorPage = location.startsWith("/editor");

  // Don't show navbar on editor page
  if (isEditorPage) {
    return null;
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle1">{user?.name}</Typography>
        <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
        <ListItemIcon>
          <DashboardIcon fontSize="small" />
        </ListItemIcon>
        Dashboard
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Log out
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Dragfolio
      </Typography>
      <Divider />
      <List>
        <ListItem onClick={() => navigate('/')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem onClick={() => navigate('/templates')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Templates" />
        </ListItem>
        {isAuthenticated && (
          <>
            <Divider />
            <ListItem onClick={() => navigate('/dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
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
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Dragfolio
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <Button
                  onClick={() => navigate('/')}
                  sx={{ my: 2, color: 'text.primary', display: 'block' }}
                >
                  Home
                </Button>
                <Button
                  onClick={() => navigate('/templates')}
                  sx={{ my: 2, color: 'text.primary', display: 'block' }}
                >
                  Templates
                </Button>
              </Box>
            )}

            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

            {isAuthenticated ? (
              <Box sx={{ display: 'flex' }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt={user.name} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      getInitials()
                    )}
                  </Avatar>
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                startIcon={<PersonIcon />}
              >
                Log in
              </Button>
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {renderMenu}
    </>
  );
}
