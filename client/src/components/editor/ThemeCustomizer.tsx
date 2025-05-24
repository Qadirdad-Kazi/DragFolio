import React, { useState, SyntheticEvent } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Switch,
  Button,
  Paper,
  Grid,
  Divider,
  Stack,
  Card,
  CardContent,
  Link
} from '@mui/material';
import {
  Check as CheckIcon,
  Palette as PaletteIcon,
  TextFields as TypeIcon,
  Dashboard as LayoutIcon,
  DarkMode as MoonIcon,
  LightMode as SunIcon
} from '@mui/icons-material';

// Theme interface
interface ThemeOptions {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  spacing: string;
}

interface ThemeCustomizerProps {
  theme: ThemeOptions;
  onThemeChange: (theme: ThemeOptions) => void;
}

// Font options
const FONT_FAMILIES = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Merriweather, serif', label: 'Merriweather' }
];

// Font size options
const FONT_SIZES = [
  { value: '14px', label: 'Small' },
  { value: '16px', label: 'Medium' },
  { value: '18px', label: 'Large' }
];

// Border radius options
const BORDER_RADIUS = [
  { value: '0', label: 'None' },
  { value: '0.25rem', label: 'Small' },
  { value: '0.5rem', label: 'Medium' },
  { value: '1rem', label: 'Large' },
  { value: '9999px', label: 'Full' }
];

// Spacing options
const SPACING = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' }
];

// Color presets
const COLOR_PRESETS = [
  { primary: '#0070f3', secondary: '#0070f3', name: 'Blue' },
  { primary: '#10b981', secondary: '#059669', name: 'Green' },
  { primary: '#f43f5e', secondary: '#e11d48', name: 'Red' },
  { primary: '#8b5cf6', secondary: '#7c3aed', name: 'Purple' },
  { primary: '#f59e0b', secondary: '#d97706', name: 'Amber' },
  { primary: '#06b6d4', secondary: '#0891b2', name: 'Cyan' }
];

export default function ThemeCustomizer({ theme, onThemeChange }: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState(0);
  
  // Update theme property
  const updateTheme = (key: keyof ThemeOptions, value: string) => {
    onThemeChange({
      ...theme,
      [key]: value
    });
  };
  
  // Apply color preset
  const applyColorPreset = (primary: string, secondary: string) => {
    onThemeChange({
      ...theme,
      primaryColor: primary,
      secondaryColor: secondary
    });
  };

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab 
          icon={<PaletteIcon fontSize="small" />} 
          label="Colors" 
          iconPosition="start"
        />
        <Tab 
          icon={<TypeIcon fontSize="small" />} 
          label="Typography" 
          iconPosition="start"
        />
        <Tab 
          icon={<LayoutIcon fontSize="small" />} 
          label="Layout" 
          iconPosition="start"
        />
        <Tab 
          icon={theme.mode === 'dark' ? <MoonIcon fontSize="small" /> : <SunIcon fontSize="small" />} 
          label="Mode" 
          iconPosition="start"
        />
        
      </Tabs>

      <Box role="tabpanel" hidden={activeTab !== 0} sx={{ mb: 3 }}>
        {activeTab === 0 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Color Presets</Typography>
              <Grid container spacing={1}>
                {COLOR_PRESETS.map((preset, index) => (
                  <Grid item xs={4} key={index}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start',
                        py: 1,
                        borderColor: theme.primaryColor === preset.primary ? 'primary.main' : 'divider'
                      }}
                      onClick={() => applyColorPreset(preset.primary, preset.secondary)}
                      startIcon={
                        <Box 
                          sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '50%', 
                            bgcolor: preset.primary 
                          }} 
                        />
                      }
                    >
                      {preset.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Primary Color</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'divider',
                    bgcolor: theme.primaryColor 
                  }}
                />
                <TextField
                  type="color"
                  fullWidth
                  value={theme.primaryColor}
                  onChange={(e) => updateTheme('primaryColor', e.target.value)}
                  size="small"
                />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Secondary Color</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'divider',
                    bgcolor: theme.secondaryColor 
                  }}
                />
                <TextField
                  type="color"
                  fullWidth
                  value={theme.secondaryColor}
                  onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                  size="small"
                />
              </Box>
            </Box>
          </Stack>
        )}
      </Box>
        
      <Box role="tabpanel" hidden={activeTab !== 1} sx={{ mb: 3 }}>
        {activeTab === 1 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Font Family</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="font-family-label">Font Family</InputLabel>
                <Select
                  labelId="font-family-label"
                  value={theme.fontFamily}
                  onChange={(e) => updateTheme('fontFamily', e.target.value)}
                  label="Font Family"
                >
                  {FONT_FAMILIES.map((font) => (
                    <MenuItem key={font.value} value={font.value}>
                      <Typography sx={{ fontFamily: font.value }}>{font.label}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Font Size</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="font-size-label">Font Size</InputLabel>
                <Select
                  labelId="font-size-label"
                  value={theme.fontSize}
                  onChange={(e) => updateTheme('fontSize', e.target.value)}
                  label="Font Size"
                >
                  {FONT_SIZES.map((size) => (
                    <MenuItem key={size.value} value={size.value}>
                      {size.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Preview</Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2,
                  fontFamily: theme.fontFamily,
                  fontSize: theme.fontSize
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ color: theme.primaryColor }}
                >
                  Sample Heading
                </Typography>
                <Typography variant="body1" paragraph>
                  This is a paragraph of text that demonstrates how your typography settings will look on your portfolio.
                </Typography>
                <Link href="#" sx={{ color: theme.secondaryColor }}>
                  Sample Link
                </Link>
              </Paper>
            </Box>
          </Stack>
        )}
      </Box>
        
      <Box role="tabpanel" hidden={activeTab !== 2} sx={{ mb: 3 }}>
        {activeTab === 2 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Border Radius</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="border-radius-label">Border Radius</InputLabel>
                <Select
                  labelId="border-radius-label"
                  value={theme.borderRadius}
                  onChange={(e) => updateTheme('borderRadius', e.target.value)}
                  label="Border Radius"
                >
                  {BORDER_RADIUS.map((radius) => (
                    <MenuItem key={radius.value} value={radius.value}>
                      {radius.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                {BORDER_RADIUS.map((radius) => (
                  <Box 
                    key={radius.value}
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      border: 1, 
                      borderColor: 'divider', 
                      bgcolor: 'action.hover',
                      borderRadius: radius.value,
                      outline: theme.borderRadius === radius.value ? 2 : 0,
                      outlineColor: 'primary.main',
                      outlineOffset: '2px',
                      cursor: 'pointer'
                    }}
                    onClick={() => updateTheme('borderRadius', radius.value)}
                  />
                ))}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Content Spacing</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="spacing-label">Content Spacing</InputLabel>
                <Select
                  labelId="spacing-label"
                  value={theme.spacing}
                  onChange={(e) => updateTheme('spacing', e.target.value)}
                  label="Content Spacing"
                >
                  {SPACING.map((spacing) => (
                    <MenuItem key={spacing.value} value={spacing.value}>
                      {spacing.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Preview</Typography>
              <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'action.hover', 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    borderTopLeftRadius: theme.borderRadius,
                    borderTopRightRadius: theme.borderRadius
                  }}
                >
                  <Box sx={{ height: 16, width: 100, bgcolor: 'grey.300', borderRadius: 1 }} />
                </Box>
                <Box 
                  sx={{ 
                    p: 2, 
                    '& > *': { 
                      my: theme.spacing === 'compact' ? 0.5 : 
                           theme.spacing === 'comfortable' ? 1 : 2 
                    }
                  }}
                >
                  <Box sx={{ height: 16, width: '100%', bgcolor: 'grey.100', borderRadius: 1 }} />
                  <Box sx={{ height: 16, width: '75%', bgcolor: 'grey.100', borderRadius: 1 }} />
                  <Box sx={{ height: 16, width: '85%', bgcolor: 'grey.100', borderRadius: 1 }} />
                </Box>
              </Paper>
            </Box>
          </Stack>
        )}
      </Box>
        
      <Box role="tabpanel" hidden={activeTab !== 3} sx={{ mb: 3 }}>
        {activeTab === 3 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Theme Mode</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper 
                    variant="outlined"
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      borderColor: theme.mode === 'light' ? 'primary.main' : 'divider',
                      bgcolor: theme.mode === 'light' ? 'primary.light' : 'background.paper',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                    onClick={() => updateTheme('mode', 'light')}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SunIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">Light Mode</Typography>
                      </Box>
                      {theme.mode === 'light' && <CheckIcon color="primary" fontSize="small" />}
                    </Box>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        bgcolor: 'common.white', 
                        p: 1.5 
                      }}
                    >
                      <Box sx={{ height: 12, width: 100, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ height: 12, width: '100%', bgcolor: 'grey.100', borderRadius: 1, mb: 0.5 }} />
                      <Box sx={{ height: 12, width: '100%', bgcolor: 'grey.100', borderRadius: 1 }} />
                    </Paper>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper 
                    variant="outlined"
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      borderColor: theme.mode === 'dark' ? 'primary.main' : 'divider',
                      bgcolor: theme.mode === 'dark' ? 'primary.light' : 'background.paper',
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                    onClick={() => updateTheme('mode', 'dark')}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MoonIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">Dark Mode</Typography>
                      </Box>
                      {theme.mode === 'dark' && <CheckIcon color="primary" fontSize="small" />}
                    </Box>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        bgcolor: 'grey.900', 
                        borderColor: 'grey.700',
                        p: 1.5 
                      }}
                    >
                      <Box sx={{ height: 12, width: 100, bgcolor: 'grey.600', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ height: 12, width: '100%', bgcolor: 'grey.700', borderRadius: 1, mb: 0.5 }} />
                      <Box sx={{ height: 12, width: '100%', bgcolor: 'grey.700', borderRadius: 1 }} />
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Auto Dark Mode</Typography>
              <FormControlLabel
                control={
                  <Switch />
                }
                label="Use system preferences"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                When enabled, your portfolio will automatically switch between light and dark mode based on visitor's system preferences.
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
