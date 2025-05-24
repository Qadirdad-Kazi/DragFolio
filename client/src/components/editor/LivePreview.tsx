import { useState, useEffect } from 'react';
import { Portfolio, PreviewDeviceType } from '@/types';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  LaptopMac as LaptopIcon,
  Tablet as TabletIcon,
  PhoneAndroid as SmartphoneIcon
} from '@mui/icons-material';

interface LivePreviewProps {
  portfolio: Portfolio;
  previewDevice: PreviewDeviceType;
  setPreviewDevice: (device: PreviewDeviceType) => void;
}

export default function LivePreview({ portfolio, previewDevice, setPreviewDevice }: LivePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Generate a preview URL based on the portfolio data
  useEffect(() => {
    // In a production app, this would call an API to generate a preview
    // For now, we'll create a data URI with the portfolio data embedded
    const generatePreview = () => {
      // Create a basic HTML template for the preview
      const previewHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${portfolio.title}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body {
              font-family: ${portfolio.theme.fontFamily};
              font-size: ${portfolio.theme.fontSize};
              color: ${portfolio.theme.mode === 'dark' ? '#ffffff' : '#000000'};
              background-color: ${portfolio.theme.mode === 'dark' ? '#121212' : '#ffffff'};
            }
            .section {
              padding: 2rem;
              margin-bottom: 2rem;
              border-radius: 0.5rem;
              background-color: ${portfolio.theme.mode === 'dark' ? '#1e1e1e' : '#f9f9f9'};
            }
            .primary-color {
              color: ${portfolio.theme.primaryColor};
            }
            .secondary-color {
              color: ${portfolio.theme.secondaryColor};
            }
          </style>
        </head>
        <body class="p-4 md:p-8">
          <header class="container mx-auto mb-8">
            <h1 class="text-3xl md:text-4xl font-bold primary-color">${portfolio.title}</h1>
            <p class="text-lg">${portfolio.description || ''}</p>
          </header>
          
          <main class="container mx-auto">
            ${portfolio.sections.sort((a, b) => a.order - b.order).map(section => {
              let sectionContent = '';
              
              switch (section.type) {
                case 'about':
                  sectionContent = `
                    <div class="flex flex-col md:flex-row gap-6">
                      ${section.content.image ? `
                        <div class="md:w-1/3">
                          <img src="${section.content.image}" alt="Profile" class="rounded-full w-48 h-48 object-cover mx-auto">
                        </div>
                      ` : ''}
                      <div class="${section.content.image ? 'md:w-2/3' : 'w-full'}">
                        <h3 class="text-xl font-medium mb-2">${section.content.headline || ''}</h3>
                        <p>${section.content.bio || ''}</p>
                      </div>
                    </div>
                  `;
                  break;
                
                case 'skills':
                  sectionContent = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      ${section.content.skills ? section.content.skills.map((skill: any) => `
                        <div class="mb-4">
                          <div class="flex justify-between mb-1">
                            <span class="font-medium">${skill.name}</span>
                            <span>${skill.level}%</span>
                          </div>
                          <div class="w-full bg-gray-300 rounded-full h-2">
                            <div class="bg-primary-color h-2 rounded-full" style="width: ${skill.level}%"></div>
                          </div>
                        </div>
                      `).join('') : ''}
                    </div>
                  `;
                  break;
                
                case 'projects':
                  sectionContent = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      ${section.content.projects ? section.content.projects.map((project: any) => `
                        <div class="border rounded-lg overflow-hidden">
                          ${project.image ? `
                            <img src="${project.image}" alt="${project.title}" class="w-full aspect-video object-cover">
                          ` : ''}
                          <div class="p-4">
                            <h3 class="text-lg font-semibold mb-2">${project.title}</h3>
                            <p class="text-gray-600 mb-4">${project.description}</p>
                            <div class="flex flex-wrap gap-2 mb-4">
                              ${project.technologies ? project.technologies.map((tech: string) => `
                                <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">${tech}</span>
                              `).join('') : ''}
                            </div>
                            <div class="flex space-x-4">
                              ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="text-primary-color">GitHub</a>` : ''}
                              ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="text-primary-color">Live Demo</a>` : ''}
                            </div>
                          </div>
                        </div>
                      `).join('') : ''}
                    </div>
                  `;
                  break;
                
                // Add other section types as needed
                
                default:
                  sectionContent = `<p>Content for ${section.type} section</p>`;
              }
              
              return `
                <section id="${section.id}" class="section mb-8">
                  <h2 class="text-2xl font-bold mb-4 primary-color">${section.title}</h2>
                  ${sectionContent}
                </section>
              `;
            }).join('')}
          </main>
          
          <footer class="container mx-auto mt-12 pt-8 border-t text-center">
            <p>© ${new Date().getFullYear()} ${portfolio.title}</p>
          </footer>
        </body>
        </html>
      `;
      
      // Create a data URI from the HTML
      const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(previewHtml)}`;
      setPreviewUrl(dataUri);
    };
    
    generatePreview();
  }, [portfolio]);
  
  // Get the device frame width based on the preview device
  const getDeviceFrameWidth = () => {
    switch (previewDevice) {
      case 'desktop':
        return '100%';
      case 'tablet':
        return '768px';
      case 'mobile':
        return '375px';
      default:
        return '100%';
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 2 }}>
        <Typography variant="h6">Live Preview</Typography>
        
        <Paper elevation={0} sx={{ bgcolor: 'action.hover', p: 0.5, borderRadius: 1 }}>
          <ToggleButtonGroup
            value={previewDevice}
            exclusive
            size="small"
            onChange={(_event, value) => value && setPreviewDevice(value)}
          >
            <ToggleButton value="desktop" aria-label="desktop preview">
              <LaptopIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="tablet" aria-label="tablet preview">
              <TabletIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="mobile" aria-label="mobile preview">
              <SmartphoneIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>
      
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'hidden', 
        bgcolor: 'action.hover', 
        p: 2, 
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <Paper 
          elevation={2} 
          sx={{ 
            width: getDeviceFrameWidth(), 
            height: '100%',
            overflow: 'hidden',
            transition: 'width 0.3s ease'
          }}
        >
          {previewUrl ? (
            <Box 
              component="iframe"
              src={previewUrl}
              title="Portfolio Preview"
              sx={{ width: '100%', height: '100%', border: 0 }}
              sandbox="allow-same-origin allow-scripts"
            />
          ) : (
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'text.secondary' 
            }}>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              <Typography>Loading preview...</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
