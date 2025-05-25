import { useState, SyntheticEvent } from 'react';
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
  Divider,
  Stack,
  Link,
  Grid
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
  headingColor?: string;
  paragraphColor?: string;
  linkColor?: string;
  accentColor?: string;
  fontFamily: string;
  fontSize: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string;
  headingFontFamily?: string;
  headingFontWeight?: string;
  borderRadius: string;
  spacing: string;
}

interface ThemeCustomizerProps {
  theme: ThemeOptions;
  onThemeChange: (theme: ThemeOptions) => void;
}

// Font options
const FONT_FAMILIES = [
  // Sans-serif fonts
  { value: 'Inter, sans-serif', label: 'Inter', category: 'sans-serif' },
  { value: 'Roboto, sans-serif', label: 'Roboto', category: 'sans-serif' },
  { value: 'Poppins, sans-serif', label: 'Poppins', category: 'sans-serif' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat', category: 'sans-serif' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans', category: 'sans-serif' },
  { value: 'Lato, sans-serif', label: 'Lato', category: 'sans-serif' },
  { value: 'Raleway, sans-serif', label: 'Raleway', category: 'sans-serif' },
  { value: 'Nunito, sans-serif', label: 'Nunito', category: 'sans-serif' },
  { value: 'Work Sans, sans-serif', label: 'Work Sans', category: 'sans-serif' },
  { value: 'Quicksand, sans-serif', label: 'Quicksand', category: 'sans-serif' },
  
  // Serif fonts
  { value: 'Playfair Display, serif', label: 'Playfair Display', category: 'serif' },
  { value: 'Merriweather, serif', label: 'Merriweather', category: 'serif' },
  { value: 'Lora, serif', label: 'Lora', category: 'serif' },
  { value: 'Libre Baskerville, serif', label: 'Libre Baskerville', category: 'serif' },
  { value: 'Crimson Text, serif', label: 'Crimson Text', category: 'serif' },
  { value: 'Cormorant Garamond, serif', label: 'Cormorant Garamond', category: 'serif' },
  
  // Monospace fonts
  { value: 'Roboto Mono, monospace', label: 'Roboto Mono', category: 'monospace' },
  { value: 'Source Code Pro, monospace', label: 'Source Code Pro', category: 'monospace' },
  { value: 'Fira Code, monospace', label: 'Fira Code', category: 'monospace' },
  
  // Display fonts
  { value: '"Abril Fatface", cursive', label: 'Abril Fatface', category: 'display' },
  { value: '"Bebas Neue", cursive', label: 'Bebas Neue', category: 'display' },
  { value: '"Pacifico", cursive', label: 'Pacifico', category: 'display' }
];

// Font size options
const FONT_SIZES = [
  { value: '12px', label: 'Extra Small' },
  { value: '14px', label: 'Small' },
  { value: '16px', label: 'Medium' },
  { value: '18px', label: 'Large' },
  { value: '20px', label: 'Extra Large' },
  { value: '24px', label: 'Huge' }
];

// Line height options
const LINE_HEIGHTS = [
  { value: '1.2', label: 'Tight' },
  { value: '1.5', label: 'Normal' },
  { value: '1.8', label: 'Relaxed' },
  { value: '2', label: 'Loose' }
];

// Letter spacing options
const LETTER_SPACINGS = [
  { value: '-0.05em', label: 'Tight' },
  { value: '0', label: 'Normal' },
  { value: '0.05em', label: 'Wide' },
  { value: '0.1em', label: 'Extra Wide' }
];

// Text transform options
const TEXT_TRANSFORMS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize' }
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
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {COLOR_PRESETS.map((preset, index) => (
                  <Box key={index}>
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
                  </Box>
                ))}
              </Box>
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

            <Box>
              <Typography variant="subtitle2" gutterBottom>Heading Color</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'divider',
                    bgcolor: theme.headingColor || (theme.mode === 'dark' ? '#ffffff' : '#000000') 
                  }}
                />
                <TextField
                  type="color"
                  fullWidth
                  value={theme.headingColor || (theme.mode === 'dark' ? '#ffffff' : '#000000')}
                  onChange={(e) => updateTheme('headingColor', e.target.value)}
                  size="small"
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Paragraph Color</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'divider',
                    bgcolor: theme.paragraphColor || (theme.mode === 'dark' ? '#cccccc' : '#333333') 
                  }}
                />
                <TextField
                  type="color"
                  fullWidth
                  value={theme.paragraphColor || (theme.mode === 'dark' ? '#cccccc' : '#333333')}
                  onChange={(e) => updateTheme('paragraphColor', e.target.value)}
                  size="small"
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Link Color</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'divider',
                    bgcolor: theme.linkColor || theme.primaryColor 
                  }}
                />
                <TextField
                  type="color"
                  fullWidth
                  value={theme.linkColor || theme.primaryColor}
                  onChange={(e) => updateTheme('linkColor', e.target.value)}
                  size="small"
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Accent Color</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'divider',
                    bgcolor: theme.accentColor || theme.secondaryColor 
                  }}
                />
                <TextField
                  type="color"
                  fullWidth
                  value={theme.accentColor || theme.secondaryColor}
                  onChange={(e) => updateTheme('accentColor', e.target.value)}
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
              <Typography variant="subtitle2" gutterBottom>Line Height</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="line-height-label">Line Height</InputLabel>
                <Select
                  labelId="line-height-label"
                  value={theme.lineHeight || '1.5'}
                  onChange={(e) => updateTheme('lineHeight', e.target.value)}
                  label="Line Height"
                >
                  {LINE_HEIGHTS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Letter Spacing</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="letter-spacing-label">Letter Spacing</InputLabel>
                <Select
                  labelId="letter-spacing-label"
                  value={theme.letterSpacing || '0'}
                  onChange={(e) => updateTheme('letterSpacing', e.target.value)}
                  label="Letter Spacing"
                >
                  {LETTER_SPACINGS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Text Transform</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="text-transform-label">Text Transform</InputLabel>
                <Select
                  labelId="text-transform-label"
                  value={theme.textTransform || 'none'}
                  onChange={(e) => updateTheme('textTransform', e.target.value)}
                  label="Text Transform"
                >
                  {TEXT_TRANSFORMS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Heading Font Family</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="heading-font-family-label">Heading Font</InputLabel>
                <Select
                  labelId="heading-font-family-label"
                  value={theme.headingFontFamily || theme.fontFamily}
                  onChange={(e) => updateTheme('headingFontFamily', e.target.value)}
                  label="Heading Font"
                >
                  <MenuItem value="same">Same as Body Font</MenuItem>
                  {FONT_FAMILIES.map((font) => (
                    <MenuItem key={font.value} value={font.value}>
                      <Typography sx={{ fontFamily: font.value }}>{font.label}</Typography>
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
                  fontSize: theme.fontSize,
                  lineHeight: theme.lineHeight || '1.5',
                  letterSpacing: theme.letterSpacing || '0',
                  textTransform: theme.textTransform || 'none',
                  backgroundColor: theme.mode === 'dark' ? '#1e1e1e' : '#ffffff'
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    color: theme.headingColor || (theme.mode === 'dark' ? '#ffffff' : '#000000'),
                    fontFamily: theme.headingFontFamily || theme.fontFamily
                  }}
                >
                  Sample Heading
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    color: theme.paragraphColor || (theme.mode === 'dark' ? '#cccccc' : '#333333')
                  }}
                >
                  This is a paragraph of text that demonstrates how your typography and color settings will look on your portfolio.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  <Link 
                    href="#" 
                    onClick={(e) => e.preventDefault()}
                    sx={{ 
                      color: theme.linkColor || theme.primaryColor,
                      textDecoration: 'underline',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  >
                    Sample Link
                  </Link>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      backgroundColor: theme.primaryColor,
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: theme.primaryColor,
                        opacity: 0.9
                      },
                      textTransform: theme.textTransform || 'none'
                    }}
                  >
                    Primary Button
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      backgroundColor: theme.accentColor || theme.secondaryColor,
                      color: '#000000',
                      '&:hover': {
                        backgroundColor: theme.accentColor || theme.secondaryColor,
                        opacity: 0.9
                      },
                      textTransform: theme.textTransform || 'none'
                    }}
                  >
                    Accent Button
                  </Button>
                </Box>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: theme.borderRadius || '4px',
                    border: '1px solid',
                    borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                  }}
                >
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: theme.paragraphColor || (theme.mode === 'dark' ? '#cccccc' : '#333333'),
                      opacity: 0.9
                    }}
                  >
                    This is a sample content box showing how your colors work together.
                  </Typography>
                </Box>
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
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
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
                </Box>
                
                <Box>
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
                </Box>
                <Box>
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
                        bgcolor: 'grey.100', 
                        borderColor: 'grey.300',
                        p: 1.5 
                      }}
                    >
                      <Box sx={{ height: 12, width: 100, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ height: 12, width: '100%', bgcolor: 'grey.200', borderRadius: 1, mb: 0.5 }} />
                      <Box sx={{ height: 12, width: '100%', bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Paper>
                  </Paper>
                </Box>
              </Box>
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
