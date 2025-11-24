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
  Paper,
  Chip
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
                  transform: 'perspective(1000px) rotateY(5deg)',
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
                  left: -20,
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
                  right: -30,
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
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                color: '#1e293b',
                mb: 3
              }}
            >
              Everything You Need to Build
              <Box component="span" sx={{ 
                display: 'block',
                color: '#667eea'
              }}>
                Your Perfect Portfolio
              </Box>
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b',
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              Professional tools and features that make portfolio creation effortless
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
                border: '1px solid rgba(103, 126, 234, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(103, 126, 234, 0.15)',
                  '& .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                    color: '#667eea'
                  }
                }
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  opacity: 0.05
                }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  <DashboardIcon className="feature-icon" sx={{ 
                    fontSize: 40, 
                    color: '#667eea',
                    mr: 2,
                    transition: 'all 0.3s ease'
                  }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Drag & Drop Builder
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ 
                  color: '#64748b',
                  lineHeight: 1.6,
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  Intuitive visual editor with pre-built blocks. Simply drag, drop, and customize to create your perfect portfolio layout without any technical knowledge.
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {['Visual Editor', 'Pre-built Blocks', 'Real-time Preview'].map((feature) => (
                    <Chip 
                      key={feature}
                      label={feature} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(103, 126, 234, 0.1)',
                        color: '#667eea',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: 'rgba(103, 126, 234, 0.2)'
                        }
                      }} 
                    />
                  ))}
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
                border: '1px solid rgba(103, 126, 234, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(103, 126, 234, 0.15)',
                  '& .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                    color: '#667eea'
                  }
                }
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  opacity: 0.05
                }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  <BrushIcon className="feature-icon" sx={{ 
                    fontSize: 40, 
                    color: '#8b5cf6',
                    mr: 2,
                    transition: 'all 0.3s ease'
                  }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Smart Templates
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ 
                  color: '#64748b',
                  lineHeight: 1.6,
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  Choose from professionally designed templates crafted by experts. Each template is fully customizable and optimized for different industries and purposes.
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {['Professional Designs', 'Industry Specific', 'Fully Customizable'].map((feature) => (
                    <Chip 
                      key={feature}
                      label={feature} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(139, 92, 246, 0.1)',
                        color: '#8b5cf6',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: 'rgba(139, 92, 246, 0.2)'
                        }
                      }} 
                    />
                  ))}
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
                border: '1px solid rgba(103, 126, 234, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(103, 126, 234, 0.15)',
                  '& .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                    color: '#667eea'
                  }
                }
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  opacity: 0.05
                }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  <DevicesIcon className="feature-icon" sx={{ 
                    fontSize: 40, 
                    color: '#06b6d4',
                    mr: 2,
                    transition: 'all 0.3s ease'
                  }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Mobile-First
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ 
                  color: '#64748b',
                  lineHeight: 1.6,
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  Every portfolio looks perfect on any device. Built with responsive design principles to ensure your work shines on desktops, tablets, and phones.
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {['Responsive Design', 'Touch Friendly', 'Fast Loading'].map((feature) => (
                    <Chip 
                      key={feature}
                      label={feature} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(6, 182, 212, 0.1)',
                        color: '#06b6d4',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: 'rgba(6, 182, 212, 0.2)'
                        }
                      }} 
                    />
                  ))}
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
                border: '1px solid rgba(103, 126, 234, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(103, 126, 234, 0.15)',
                  '& .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                    color: '#667eea'
                  }
                }
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  opacity: 0.05
                }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  <CloudDownloadIcon className="feature-icon" sx={{ 
                    fontSize: 40, 
                    color: '#10b981',
                    mr: 2,
                    transition: 'all 0.3s ease'
                  }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Export Anywhere
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ 
                  color: '#64748b',
                  lineHeight: 1.6,
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  Export your portfolio as HTML/CSS or deploy instantly to popular hosting platforms. Keep full ownership of your work with flexible export options.
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {['HTML Export', 'One-Click Deploy', 'Custom Domain'].map((feature) => (
                    <Chip 
                      key={feature}
                      label={feature} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: 'rgba(16, 185, 129, 0.2)'
                        }
                      }} 
                    />
                  ))}
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
                border: '1px solid rgba(103, 126, 234, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(103, 126, 234, 0.15)',
                  '& .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                    color: '#667eea'
                  }
                }
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  opacity: 0.05
                }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  <SpeedIcon className="feature-icon" sx={{ 
                    fontSize: 40, 
                    color: '#f59e0b',
                    mr: 2,
                    transition: 'all 0.3s ease'
                  }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Lightning Fast
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ 
                  color: '#64748b',
                  lineHeight: 1.6,
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  Optimized performance with fast loading times and smooth interactions. Built with modern web technologies for the best user experience.
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {['Optimized Code', 'CDN Ready', 'SEO Friendly'].map((feature) => (
                    <Chip 
                      key={feature}
                      label={feature} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: 'rgba(245, 158, 11, 0.2)'
                        }
                      }} 
                    />
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(103, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
          `,
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                color: 'white',
                mb: 3
              }}
            >
              Ready to Create Your
              <Box component="span" sx={{ 
                display: 'block',
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Dream Portfolio?
              </Box>
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 600,
                mx: 'auto',
                mb: 6,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              Join thousands of creators who've built stunning portfolios with DragFolio
            </Typography>

            <Box sx={{ mb: 6 }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/register')}
                sx={{ 
                  bgcolor: 'white',
                  color: '#1e293b',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
                  },
                  mr: { xs: 0, sm: 3 },
                  mb: { xs: 2, sm: 0 }
                }}
              >
                Start Building Free
              </Button>
              
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/templates')}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Browse Templates
              </Button>
            </Box>

            {/* Social Proof */}
            <Grid container spacing={4} sx={{ maxWidth: 800, mx: 'auto' }}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                    10K+
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Portfolios Created
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                    50+
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Templates
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                    99%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Satisfaction Rate
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                    24/7
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Support
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