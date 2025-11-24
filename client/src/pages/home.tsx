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
  Devices as DevicesIcon,
  CloudDownload as CloudDownloadIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  AutoAwesome as AutoAwesomeIcon,
  Analytics as AnalyticsIcon,
  Palette as PaletteIcon,
  PlayArrow as PlayArrowIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";

export default function Home() {
  const [_, navigate] = useLocation();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
          `,
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                    mb: 3,
                    color: 'white',
                    lineHeight: 1.1,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}
                >
                  Create Your
                  <Box component="span" sx={{ 
                    display: 'block',
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Portfolio
                  </Box>
                  Without Code
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4,
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    fontWeight: 400,
                    maxWidth: 500
                  }}
                >
                  Build stunning, professional portfolios in minutes with our intuitive drag-and-drop builder.
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  mb: 4,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  flexWrap: 'wrap'
                }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => navigate("/register")}
                    sx={{
                      bgcolor: 'white',
                      color: '#667eea',
                      px: 4,
                      py: 2,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.95)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Start Building Free
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/templates")}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.7)',
                      color: 'white',
                      px: 4,
                      py: 2,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      textTransform: 'none',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View Templates
                  </Button>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 4,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'center',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: '#4ade80', borderRadius: '50%' }} />
                    No Coding Required
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: '#4ade80', borderRadius: '50%' }} />
                    100% Free
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: '#4ade80', borderRadius: '50%' }} />
                    Mobile Ready
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                position: 'relative',
                textAlign: 'center'
              }}>
                {/* Main Portfolio Preview */}
                <Box sx={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  borderRadius: 4,
                  p: 3,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg) scale(1.02)',
                  }
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
                    ✨ Live Portfolio Builder
                  </Typography>
                  
                  {/* Mock Portfolio Interface */}
                  <Box sx={{ 
                    height: 350, 
                    bgcolor: 'rgba(255,255,255,0.95)', 
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Header */}
                    <Box sx={{ 
                      height: 50, 
                      bgcolor: '#f8fafc', 
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      gap: 1
                    }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#ef4444', borderRadius: '50%' }} />
                      <Box sx={{ width: 12, height: 12, bgcolor: '#f59e0b', borderRadius: '50%' }} />
                      <Box sx={{ width: 12, height: 12, bgcolor: '#10b981', borderRadius: '50%' }} />
                    </Box>
                    
                    {/* Content */}
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ 
                        width: 80, 
                        height: 80, 
                        background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                        borderRadius: '50%',
                        mx: 'auto',
                        mb: 2
                      }} />
                      <Box sx={{ height: 20, bgcolor: '#1f2937', borderRadius: 1, mb: 1, mx: 4 }} />
                      <Box sx={{ height: 12, bgcolor: '#6b7280', borderRadius: 1, mb: 3, mx: 6 }} />
                      
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={4}>
                          <Box sx={{ height: 60, bgcolor: '#e5e7eb', borderRadius: 1 }} />
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ height: 60, bgcolor: '#e5e7eb', borderRadius: 1 }} />
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ height: 60, bgcolor: '#e5e7eb', borderRadius: 1 }} />
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ height: 8, bgcolor: '#d1d5db', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ height: 8, bgcolor: '#d1d5db', borderRadius: 1, width: '80%' }} />
                    </Box>
                  </Box>
                </Box>

                {/* Floating Elements */}
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 60,
                  height: 60,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  animation: 'float 3s ease-in-out infinite'
                }}>
                  <DashboardIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Box sx={{
                  position: 'absolute',
                  bottom: -10,
                  left: -30,
                  width: 50,
                  height: 50,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  animation: 'float 3s ease-in-out infinite 1s'
                }}>
                  <PaletteIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Floating Animation Keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Why Choose DragFolio?
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 800, 
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 400
              }}
            >
              Everything you need to create stunning portfolios that stand out and get results
            </Typography>
          </Box>
          
          {/* Features Grid */}
          <Grid container spacing={4}>
            {/* Feature 1 - Drag & Drop Builder (Main Feature) */}
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                p: 6,
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 4,
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    borderRadius: '20px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 4,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <DashboardIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                    Drag & Drop Builder
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, lineHeight: 1.6, mb: 3 }}>
                    Create stunning portfolios with our intuitive drag-and-drop interface. No coding skills required - just drag, drop, and customize your way to success.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      px: 2, 
                      py: 1, 
                      borderRadius: 2,
                      fontSize: '0.9rem'
                    }}>
                      ✨ No Coding Required
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      px: 2, 
                      py: 1, 
                      borderRadius: 2,
                      fontSize: '0.9rem'
                    }}>
                      🎨 Visual Editor
                    </Box>
                    <Box sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      px: 2, 
                      py: 1, 
                      borderRadius: 2,
                      fontSize: '0.9rem'
                    }}>
                      ⚡ Real-time Preview
                    </Box>
                  </Box>
                </Box>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }} />
              </Card>
            </Grid>

            {/* Feature 2 - Professional Templates */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4,
                height: '100%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 4,
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 60px rgba(240, 147, 251, 0.4)',
                },
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    borderRadius: '16px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 3,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <PaletteIcon sx={{ fontSize: 30, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Smart Templates
                  </Typography>
                  <Typography sx={{ opacity: 0.9, lineHeight: 1.5 }}>
                    50+ professionally designed templates for every profession and style.
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Feature 3 - Responsive Design */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4,
                height: '100%',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 4,
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 60px rgba(79, 172, 254, 0.4)',
                },
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    borderRadius: '16px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 3,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <DevicesIcon sx={{ fontSize: 30, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Mobile-First
                  </Typography>
                  <Typography sx={{ opacity: 0.9, lineHeight: 1.5 }}>
                    Perfect on all devices - desktop, tablet, and mobile optimization.
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Feature 4 - Export Options */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4,
                height: '100%',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                borderRadius: 4,
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 60px rgba(250, 112, 154, 0.4)',
                },
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    borderRadius: '16px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 3,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <CloudDownloadIcon sx={{ fontSize: 30, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Export Anywhere
                  </Typography>
                  <Typography sx={{ opacity: 0.9, lineHeight: 1.5 }}>
                    Download as HTML, PDF, or share online with custom domains.
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Feature 5 - Lightning Fast */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4,
                height: '100%',
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                color: '#2d3748',
                borderRadius: 4,
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 60px rgba(168, 237, 234, 0.4)',
                },
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'rgba(45,55,72,0.1)', 
                    borderRadius: '16px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 3,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <SpeedIcon sx={{ fontSize: 30, color: '#2d3748' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Lightning Fast
                  </Typography>
                  <Typography sx={{ opacity: 0.8, lineHeight: 1.5 }}>
                    Optimized performance with instant loading and smooth interactions.
                  </Typography>
                </Box>
              </Card>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
          `,
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: 'white',
                mb: 3,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Ready to Stand Out?
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto', 
                mb: 5,
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Join thousands of professionals who've built stunning portfolios that get results. Start your journey today - it's completely free!
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 6
            }}>
              <Button 
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={() => navigate("/register")}
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  px: 6,
                  py: 2.5,
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Start Building Now
              </Button>
              
              <Button 
                variant="outlined"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/templates")}
                sx={{
                  borderColor: 'rgba(255,255,255,0.7)',
                  color: 'white',
                  px: 6,
                  py: 2.5,
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Browse Templates
              </Button>
            </Box>

            {/* Stats/Social Proof */}
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    10k+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Portfolios Created
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    50+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Professional Templates
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    100%
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Free Forever
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}