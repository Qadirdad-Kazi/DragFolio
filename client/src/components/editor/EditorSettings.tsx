import { useState, useEffect, SyntheticEvent } from 'react';
import { Portfolio, PortfolioSection, PortfolioTheme, PreviewDeviceType } from '@/types';
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
  Paper,
  Stack,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  LaptopMac as LaptopIcon,
  Tablet as TabletIcon,
  PhoneAndroid as SmartphoneIcon
} from '@mui/icons-material';
import ThemeCustomizer from './ThemeCustomizer';

interface EditorSettingsProps {
  portfolio: Portfolio;
  selectedSection: string | null;
  updateSection: (id: string, updates: Partial<PortfolioSection>) => void;
  updateTheme: (updates: Partial<PortfolioTheme>) => void;
  updatePortfolioDetails: (updates: Partial<Portfolio>) => void;
  previewDevice: PreviewDeviceType;
  setPreviewDevice: (device: PreviewDeviceType) => void;
}

export default function EditorSettings({
  portfolio,
  selectedSection,
  updateSection,
  updateTheme,
  updatePortfolioDetails,
  previewDevice,
  setPreviewDevice
}: EditorSettingsProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<PortfolioSection | null>(null);

  // Update current section when selected section changes
  useEffect(() => {
    if (selectedSection) {
      const section = portfolio.sections.find(s => s.id === selectedSection);
      setCurrentSection(section || null);
      setActiveTab(1); // Section tab
    } else {
      setCurrentSection(null);
      setActiveTab(0); // General tab
    }
  }, [selectedSection, portfolio.sections]);

  // Handle section title change
  const handleSectionTitleChange = (title: string) => {
    if (currentSection) {
      updateSection(currentSection.id, { title });
    }
  };

  // Handle section layout change
  const handleSectionLayoutChange = (layout: 'full' | 'half' | 'two-columns') => {
    if (currentSection) {
      updateSection(currentSection.id, { layout });
    }
  };

  // Theme updates are now handled by the ThemeCustomizer component

  // Handle portfolio title change
  const handlePortfolioTitleChange = (title: string) => {
    updatePortfolioDetails({ title });
  };

  // Handle portfolio description change
  const handlePortfolioDescriptionChange = (description: string) => {
    updatePortfolioDetails({ description });
  };

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', overflow: 'auto', p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Settings</Typography>
        
        {/* Preview Device Toggles */}
        <Paper elevation={0} sx={{ bgcolor: 'action.hover', p: 0.5, borderRadius: 1 }}>
          <ToggleButtonGroup
            value={previewDevice}
            exclusive
            size="small"
            onChange={(_event, value) => value && setPreviewDevice(value)}
          >
            <ToggleButton value="desktop" aria-label="desktop">
              <LaptopIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="tablet" aria-label="tablet">
              <TabletIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="mobile" aria-label="mobile">
              <SmartphoneIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="General" />
        <Tab 
          label="Section" 
          disabled={!currentSection}
        />
        <Tab label="Theme" />
      </Tabs>
      
      {/* General Settings */}
      <Box role="tabpanel" hidden={activeTab !== 0} sx={{ mb: 3 }}>
        {activeTab === 0 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Portfolio Title</Typography>
              <TextField
                fullWidth
                size="small"
                value={portfolio.title}
                onChange={(e) => handlePortfolioTitleChange(e.target.value)}
                placeholder="My Portfolio"
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Description</Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                value={portfolio.description || ''}
                onChange={(e) => handlePortfolioDescriptionChange(e.target.value)}
                placeholder="A brief description of your portfolio"
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Published</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={portfolio.isPublished}
                    onChange={(e) => updatePortfolioDetails({ isPublished: e.target.checked })}
                  />
                }
                label={portfolio.isPublished ? 'Public' : 'Private'}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {portfolio.isPublished
                  ? 'Your portfolio is visible to the public.'
                  : 'Your portfolio is only visible to you.'}
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
        
      {/* Section Settings */}
      <Box role="tabpanel" hidden={activeTab !== 1} sx={{ mb: 3 }}>
        {activeTab === 1 && (
          currentSection ? (
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>Section Title</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={currentSection.title}
                  onChange={(e) => handleSectionTitleChange(e.target.value)}
                  placeholder="Section Title"
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>Layout</Typography>
                <FormControl fullWidth size="small">
                  <InputLabel id="section-layout-label">Layout</InputLabel>
                  <Select
                    labelId="section-layout-label"
                    value={currentSection.layout}
                    onChange={(e) => handleSectionLayoutChange(e.target.value as 'full' | 'half' | 'two-columns')}
                    label="Layout"
                  >
                    <MenuItem value="full">Full Width</MenuItem>
                    <MenuItem value="half">Half Width</MenuItem>
                    <MenuItem value="two-columns">Two Columns</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {/* Section-specific settings would go here */}
              <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>Section Content</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Edit the content of this section in the main canvas by clicking on the elements.
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography color="text.secondary">Select a section to edit its settings.</Typography>
            </Box>
          )
        )}
      </Box>
        
      {/* Theme Settings */}
      <Box role="tabpanel" hidden={activeTab !== 2} sx={{ mb: 3 }}>
        {activeTab === 2 && (
          <ThemeCustomizer
            theme={{
              mode: portfolio.theme.mode,
              primaryColor: portfolio.theme.primaryColor,
              secondaryColor: portfolio.theme.secondaryColor,
              headingColor: portfolio.theme.headingColor,
              paragraphColor: portfolio.theme.paragraphColor,
              linkColor: portfolio.theme.linkColor,
              accentColor: portfolio.theme.accentColor,
              fontFamily: portfolio.theme.fontFamily,
              fontSize: portfolio.theme.fontSize,
              lineHeight: portfolio.theme.lineHeight,
              letterSpacing: portfolio.theme.letterSpacing,
              textTransform: portfolio.theme.textTransform,
              headingFontFamily: portfolio.theme.headingFontFamily,
              headingFontWeight: portfolio.theme.headingFontWeight,
              borderRadius: portfolio.theme.borderRadius || '4px',
              spacing: (portfolio.theme.spacing as 'compact' | 'comfortable' | 'spacious') || 'comfortable'
            }}
            onThemeChange={(themeOptions) => {
              // Convert spacing to the correct type before updating
              const updatedTheme: Partial<PortfolioTheme> = {
                ...themeOptions,
                spacing: themeOptions.spacing as 'compact' | 'comfortable' | 'spacious' | undefined
              };
              updateTheme(updatedTheme);
            }}
          />
        )}
      </Box>
    </Box>
  );
}
