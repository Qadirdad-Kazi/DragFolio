import { useLocation } from "wouter";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Paper
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Brush as BrushIcon,
  Devices as DevicesIcon
} from "@mui/icons-material";

export default function Home() {
  const [_, navigate] = useLocation();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid sx={{ gridColumn: { xs: 12, md: 6 } }}>
              <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                  Create Your Portfolio <Box component="span" color="primary.main">Without Code</Box>
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  Drag, drop, and customize your professional portfolio in minutes.
                  Show off your work with our beautiful templates and easy-to-use builder.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={() => navigate("/templates")}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate("/about")}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid sx={{ gridColumn: { xs: 12, md: 6 } }}>
              <Box sx={{ 
                animation: 'fadeIn 0.5s ease-out 0.2s both',
                position: 'relative',
                '& img': {
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3
                }
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Portfolio Builder" 
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Powerful Features
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Everything you need to create and manage your professional portfolio
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid sx={{ gridColumn: { xs: 12, md: 4 } }}>
              <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'primary.light', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <DashboardIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Drag & Drop Builder
                </Typography>
                <Typography color="text.secondary">
                  Create your portfolio with our intuitive drag and drop interface. No coding required.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 12, md: 4 } }}>
              <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'primary.light', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <BrushIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Customizable Themes
                </Typography>
                <Typography color="text.secondary">
                  Choose from a variety of professional themes and customize colors, fonts, and layouts.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 12, md: 4 } }}>
              <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'primary.light', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <DevicesIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Responsive Design
                </Typography>
                <Typography color="text.secondary">
                  Your portfolio will look great on all devices - desktop, tablet, and mobile.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Templates Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Professional Templates
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Start with a beautiful template designed for different professions
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid sx={{ gridColumn: { xs: 12, md: 4 } }}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Developer Template"
                />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Developer
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Perfect for showcasing your coding projects
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => navigate("/templates")} 
                    sx={{ mt: 2 }}
                  >
                    View Template
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 12, md: 4 } }}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Designer Template"
                />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Designer
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Highlight your creative work and design skills
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => navigate("/templates")} 
                    sx={{ mt: 2 }}
                  >
                    View Template
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 12, md: 4 } }}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                  alt="Photographer Template"
                />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Photographer
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Display your photography in a stunning gallery
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => navigate("/templates")} 
                    sx={{ mt: 2 }}
                  >
                    View Template
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate("/templates")}
            >
              View All Templates
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Ready to Build Your Portfolio?
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
              Join thousands of professionals who have created stunning portfolios with our platform.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              size="large"
              onClick={() => navigate("/templates")}
            >
              Get Started For Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Add a keyframe animation for fade in effect */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}
