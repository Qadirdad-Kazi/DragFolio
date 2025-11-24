import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { portfolioApi } from '../services/api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EditorSidebar from '@/components/editor/EditorSidebar';
import EditorCanvas from '@/components/editor/EditorCanvas';
import EditorSettings from '@/components/editor/EditorSettings';
import ExportModal from '@/components/editor/ExportModal';
// import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDefaultTitle, getDefaultContent, reorder } from '@/lib/utils';
import { downloadPortfolioHtml, downloadPortfolioPdf } from '@/lib/exportUtils';
import { SectionType, PortfolioSection, PortfolioTheme, Portfolio, PreviewDeviceType } from '@/types';

export default function Editor() {
  const { id: paramId } = useParams();
  const [location] = useLocation();
  const { toast } = useToast();

  // Extract portfolio ID from URL query parameters
  const getPortfolioId = () => {
    // First check if we have an ID in the URL path
    if (paramId && paramId !== 'undefined') {
      console.log('Using portfolio ID from URL path:', paramId);
      return paramId;
    }

    // Parse the current URL to get query parameters
    let queryId = null;
    try {
      // Handle different location types (string or Location object)
      let queryString = '';
      if (typeof location === 'string') {
        queryString = location.includes('?') ? location.split('?')[1] : '';
      } else if (typeof window !== 'undefined') {
        // Use window.location if available
        queryString = window.location.search.substring(1);
      }

      // Extract the ID parameter
      const searchParams = new URLSearchParams(queryString);
      queryId = searchParams.get('id');

      if (queryId && queryId !== 'undefined') {
        console.log('Using portfolio ID from query parameters:', queryId);
        return queryId;
      }
    } catch (e) {
      console.error('Error parsing URL query parameters:', e);
    }

    // Check if we have stored template data with an ID
    const storedTemplateData = localStorage.getItem('selectedTemplateData');
    if (storedTemplateData) {
      try {
        const templateData = JSON.parse(storedTemplateData);
        if (templateData && templateData.id) {
          console.log('Using portfolio ID from stored template data:', templateData.id);
          return templateData.id;
        }
      } catch (e) {
        console.error('Error parsing stored template data:', e);
      }
    }

    // Check if we have backup portfolio data with an ID
    const backupData = localStorage.getItem('editingPortfolioData');
    if (backupData) {
      try {
        const portfolioData = JSON.parse(backupData);
        if (portfolioData && (portfolioData._id || portfolioData.id)) {
          const backupId = portfolioData._id || portfolioData.id;
          console.log('Using portfolio ID from backup data:', backupId);
          return backupId;
        }
      } catch (e) {
        console.error('Error parsing backup portfolio data:', e);
      }
    }

    console.log('No valid portfolio ID found');
    return null; // Return null instead of empty string to clearly indicate no valid ID
  };

  const portfolioId = getPortfolioId();

  // State for portfolio data
  const [portfolio, setPortfolio] = useState<Portfolio>({
    title: 'My Portfolio',
    description: 'My professional portfolio',
    sections: [],
    theme: {
      mode: 'light',
      primaryColor: '#2563eb', // Professional blue
      secondaryColor: '#64748b', // Slate gray - more professional than yellow
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px'
    },
    isPublished: false
  });

  // State for selected section
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // State for preview device
  const [previewDevice, setPreviewDevice] = useState<PreviewDeviceType>('desktop');

  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for saving
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // State for export modal
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [exportType, setExportType] = useState<'html' | 'pdf'>('html');

  // Load portfolio data or initialize from template
  useEffect(() => {
    // Check if we have a template ID in the URL
    const searchParams = new URLSearchParams(typeof location === 'string' && location.includes('?') ? location.split('?')[1] : '');
    const templateId = searchParams.get('template');
    const queryId = searchParams.get('id');

    // Log all parameters for debugging
    console.log('URL parameters:', { paramId, queryId, portfolioId, templateId });

    // Check if we have template data in localStorage
    const storedTemplateData = localStorage.getItem('selectedTemplateData');

    // Check if we have backup portfolio data in localStorage
    const backupPortfolioData = localStorage.getItem('editingPortfolioData');
    if (backupPortfolioData) {
      console.log('Found backup portfolio data in localStorage');
    }

    // Set loading state
    setIsLoading(true);

    if (templateId) {
      // Initialize from template ID in URL
      console.log('Initializing portfolio from template ID in URL:', templateId);

      portfolioApi.create({
        title: 'New Portfolio',
        description: `Created from template`,
        template: templateId,
        isPublished: false,
        userId: JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || '')).id || 'demo-user',
        sections: [],
        theme: {
          mode: 'light' as const,
          primaryColor: '#000000',
          secondaryColor: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px'
        }
      })
        .then((newPortfolio) => {
          console.log('New portfolio created:', newPortfolio);
          setPortfolio(newPortfolio);
          // Select the first section if available
          if (newPortfolio.sections && newPortfolio.sections.length > 0) {
            setSelectedSection(newPortfolio.sections[0].id);
          }
        })
        .catch(error => {
          console.error('Error creating portfolio from template:', error);
          toast({
            title: 'Error',
            description: 'Failed to create portfolio from template. Please try again.',
            variant: 'destructive'
          });
        })
        .finally(() => {
          setIsLoading(false);
          // Clear template data from localStorage after using it
          localStorage.removeItem('selectedTemplateData');
        });
    } else if (queryId || paramId || portfolioId) {
      // Determine which ID to use, prioritizing query parameter
      const idToLoad = queryId || paramId || portfolioId;

      // Load existing portfolio
      console.log('Loading portfolio with ID:', idToLoad);

      // Check if we have stored template data for this portfolio ID
      if (storedTemplateData) {
        try {
          const templateData = JSON.parse(storedTemplateData);

          // Verify this is the correct portfolio
          if (templateData.id === idToLoad) {
            console.log('Found stored template data for portfolio:', templateData);

            // Load portfolio from API first to get the latest data
            portfolioApi.getById(idToLoad)
              .then(data => {
                console.log('Portfolio data loaded from API:', data);

                // If the portfolio has no sections or is missing theme data,
                // use the template data we stored
                if (!data.sections || data.sections.length === 0) {
                  console.log('Using stored template sections:', templateData.sections);
                  data.sections = templateData.sections;
                }

                if (!data.theme || Object.keys(data.theme).length === 0) {
                  console.log('Using stored template theme:', templateData.theme);
                  data.theme = templateData.theme;
                }

                setPortfolio(data);

                // Select the first section if available
                if (data.sections && data.sections.length > 0) {
                  setSelectedSection(data.sections[0].id);
                }

                // Clear template data from localStorage after using it
                localStorage.removeItem('selectedTemplateData');
              })
              .catch(error => {
                console.error('Error loading portfolio:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to load portfolio. Starting with a blank portfolio.',
                  variant: 'destructive'
                });
                // Reset to default portfolio state
                setPortfolio({
                  title: 'My Portfolio',
                  description: 'My professional portfolio',
                  sections: [],
                  theme: {
                    mode: 'light',
                    primaryColor: '#2563eb',
                    secondaryColor: '#64748b',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px'
                  },
                  isPublished: false
                });
              })
              .finally(() => {
                setIsLoading(false);
              });
            return; // Exit early since we're handling the loading separately
          }
        } catch (e) {
          console.error('Error parsing stored template data:', e);
          // Continue with normal portfolio loading if there's an error
        }
      }

      // Normal portfolio loading if no stored template data is found
      portfolioApi.getById(idToLoad)
        .then(data => {
          console.log('Portfolio data loaded successfully from API:', data);

          // Check if we received valid portfolio data
          if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
            throw new Error('Received empty portfolio data from API');
          }

          setPortfolio(data);

          // Select the first section if available
          if (data.sections && data.sections.length > 0) {
            setSelectedSection(data.sections[0].id);
          }

          // Show success message
          toast({
            title: 'Portfolio Loaded',
            description: `Successfully loaded "${data.title}"`,
            variant: 'default'
          });
        })
        .catch(error => {
          console.error('Error loading portfolio from API:', error);

          // Try to load from localStorage backup
          const backupData = localStorage.getItem('editingPortfolioData');
          if (backupData) {
            try {
              const parsedBackupData = JSON.parse(backupData);
              console.log('Loading portfolio from localStorage backup:', parsedBackupData);

              if (parsedBackupData && (parsedBackupData.title || parsedBackupData.sections)) {
                setPortfolio(parsedBackupData);

                // Select the first section if available
                if (parsedBackupData.sections && parsedBackupData.sections.length > 0) {
                  setSelectedSection(parsedBackupData.sections[0].id);
                }

                toast({
                  title: 'Portfolio Loaded from Backup',
                  description: `Loaded "${parsedBackupData.title}" from local backup`,
                  variant: 'default'
                });

                return; // Exit early since we successfully loaded from backup
              }
            } catch (backupError) {
              console.error('Error parsing backup portfolio data:', backupError);
            }
          }

          // If we reach here, both API and backup failed
          toast({
            title: 'Error',
            description: 'Failed to load portfolio. Starting with a blank portfolio.',
            variant: 'destructive'
          });

          // Reset to default portfolio state
          setPortfolio({
            title: 'My Portfolio',
            description: 'My professional portfolio',
            sections: [],
            theme: {
              mode: 'light',
              primaryColor: '#2563eb',
              secondaryColor: '#64748b',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px'
            },
            isPublished: false
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // No template ID or portfolio ID, try to load from backup
      console.log('No template ID or portfolio ID found, checking for backup data');

      // Try to load from localStorage backup
      const backupData = localStorage.getItem('editingPortfolioData');
      if (backupData) {
        try {
          const parsedBackupData = JSON.parse(backupData);
          console.log('Loading portfolio from localStorage backup:', parsedBackupData);

          if (parsedBackupData && (parsedBackupData.title || parsedBackupData.sections)) {
            setPortfolio(parsedBackupData);

            // Select the first section if available
            if (parsedBackupData.sections && parsedBackupData.sections.length > 0) {
              setSelectedSection(parsedBackupData.sections[0].id);
            }

            toast({
              title: 'Portfolio Loaded from Backup',
              description: `Loaded "${parsedBackupData.title}" from local backup`,
              variant: 'default'
            });

            setIsLoading(false);
            return; // Exit early since we successfully loaded from backup
          }
        } catch (backupError) {
          console.error('Error parsing backup portfolio data:', backupError);
        }
      }

      // If no backup data or loading failed, start with a blank portfolio
      console.log('No backup data found, starting with blank portfolio');
      setIsLoading(false);
    }
  }, [paramId, portfolioId, location, toast]);

  // Add a new section
  const addSection = (type: SectionType) => {
    const newSection: PortfolioSection = {
      id: `${type}-${Date.now()}`,
      type,
      title: getDefaultTitle(type),
      content: getDefaultContent(type),
      order: portfolio.sections.length,
      layout: 'full'
    };

    setPortfolio(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));

    setSelectedSection(newSection.id);
  };

  // Remove a section
  const removeSection = (id: string) => {
    setPortfolio(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== id)
    }));

    if (selectedSection === id) {
      setSelectedSection(null);
    }
  };

  // Update a section
  const updateSection = (id: string, updates: Partial<PortfolioSection>) => {
    setPortfolio(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      )
    }));
  };

  // Reorder sections
  const reorderSections = (sourceIndex: number, destinationIndex: number) => {
    // Use the reorder utility function
    const reorderedSections = reorder(portfolio.sections, sourceIndex, destinationIndex);

    // Update order property
    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      order: index
    }));

    setPortfolio(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  // Move section up or down
  const moveSection = (id: string, direction: 'up' | 'down') => {
    const sortedSections = [...portfolio.sections].sort((a, b) => a.order - b.order);
    const sectionIndex = sortedSections.findIndex(s => s.id === id);

    if (sectionIndex === -1) return;

    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;

    // Check bounds
    if (newIndex < 0 || newIndex >= sortedSections.length) return;

    reorderSections(sectionIndex, newIndex);
  };

  // Update theme
  const updateTheme = (updates: Partial<PortfolioTheme>) => {
    // Create a new theme object with the updates
    const updatedTheme = {
      ...portfolio.theme,
      ...updates
    };

    // Update the portfolio state with the new theme
    setPortfolio(prev => ({
      ...prev,
      theme: updatedTheme
    }));

    // Apply theme changes to the document for global styling
    document.documentElement.setAttribute('data-theme', updatedTheme.mode);

    // Update CSS variables for theme colors
    document.documentElement.style.setProperty('--primary-color', updatedTheme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', updatedTheme.secondaryColor);
    document.documentElement.style.setProperty('--font-family', updatedTheme.fontFamily);
    document.documentElement.style.setProperty('--font-size', updatedTheme.fontSize);

    // Save theme changes to localStorage for persistence
    try {
      localStorage.setItem('dragfolio-theme', JSON.stringify(updatedTheme));
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  };

  // Update portfolio details
  const updatePortfolioDetails = (updates: Partial<Portfolio>) => {
    setPortfolio(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Save portfolio
  const savePortfolio = async () => {
    setIsSaving(true);

    try {
      // Get template ID from URL if it exists
      const searchParams = new URLSearchParams(location.includes('?') ? location.split('?')[1] : '');
      const templateId = searchParams.get('template');

      let data;

      if (portfolioId) {
        // Update existing portfolio
        data = await portfolioApi.update(portfolioId, portfolio);
      } else {
        // Create new portfolio from template
        data = await portfolioApi.create({
          ...portfolio,
          template: templateId || undefined
        });
      }

      // Update portfolio ID in state if it's a new portfolio
      if (!portfolioId) {
        setPortfolio(prev => ({
          ...prev,
          id: data.id
        }));
      }

      toast({
        title: '🎉 Success!',
        description: '✨ Your portfolio has been saved successfully and is ready to impress!',
        duration: 4000,
      });

      return data;
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: '❌ Oops!',
        description: '😔 Failed to save portfolio. Please check your connection and try again.',
        variant: 'destructive',
        duration: 5000,
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete portfolio
  const deletePortfolio = async (id: string) => {
    try {
      setIsSaving(true);
      await portfolioApi.delete(id);
      toast({
        title: 'Success',
        description: 'Portfolio deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete portfolio. Please try again.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Export portfolio as HTML with CSP headers to fix Content Security Policy issues
  const exportPortfolioAsHtml = async () => {
    try {
      console.log('Starting HTML export process...');
      setIsSaving(true);
      let idToExport = portfolioId;

      if (!idToExport) {
        // Save first if this is a new portfolio
        console.log('No portfolio ID found, saving portfolio first...');
        const savedPortfolio = await savePortfolio();
        idToExport = savedPortfolio.id;
        console.log('Portfolio saved with ID:', idToExport);
      }

      // Make sure we have a valid ID before proceeding
      if (!idToExport) {
        throw new Error('Failed to get a valid portfolio ID for export');
      }

      console.log('Calling downloadPortfolioHtml with ID:', idToExport);
      // Use the utility function to download the HTML with proper CSP headers
      await downloadPortfolioHtml(idToExport, portfolio.title || 'portfolio');

      toast({
        title: 'HTML Export Complete',
        description: 'Your portfolio has been exported as HTML. Check your downloads folder.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error exporting portfolio as HTML:', error);
      toast({
        title: 'HTML Export Failed',
        description: 'There was an error exporting your portfolio as HTML. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Export portfolio as PDF
  const exportPortfolioAsPdf = async () => {
    try {
      console.log('Starting PDF export process...');
      setIsSaving(true);
      let idToExport = portfolioId;

      if (!idToExport) {
        // Save first if this is a new portfolio
        console.log('No portfolio ID found, saving portfolio first...');
        const savedPortfolio = await savePortfolio();
        idToExport = savedPortfolio.id;
        console.log('Portfolio saved with ID:', idToExport);
      }

      // Make sure we have a valid ID before proceeding
      if (!idToExport) {
        throw new Error('Failed to get a valid portfolio ID for export');
      }

      console.log('Calling downloadPortfolioPdf with ID:', idToExport);
      // Use the utility function to download the PDF
      await downloadPortfolioPdf(idToExport, portfolio.title || 'portfolio');

      toast({
        title: 'PDF Export Started',
        description: 'Your portfolio is being prepared as PDF. Please select "Save as PDF" in the print dialog.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error exporting portfolio as PDF:', error);
      toast({
        title: 'PDF Export Failed',
        description: 'There was an error exporting your portfolio as PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Main export function that shows export options
  const exportPortfolio = async (): Promise<void> => {
    // Open the export modal
    setExportModalOpen(true);
    setExportType('html'); // Default to HTML export
  };

  // Handle export based on selected type
  const handleExport = async (): Promise<void> => {
    console.log(`Handling export with type: ${exportType}`);
    if (exportType === 'html') {
      return exportPortfolioAsHtml();
    } else {
      return exportPortfolioAsPdf();
    }
  };

  // Deployment functionality removed

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor-layout flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Export Modal */}
        <ExportModal
          portfolio={portfolio}
          open={exportModalOpen}
          onOpenChange={(open) => {
            setExportModalOpen(open);
            // If modal is closed, reset export type to default
            if (!open) {
              setExportType('html');
            }
          }}
          onExport={handleExport}
          onExportTypeChange={setExportType}
        />
        {/* Header with actions */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-10 shadow-lg">
          <div className="flex items-center space-x-4">
          </div>

          <div className="flex items-center space-x-3">
            {/* View Live Button */}
            {portfolio.isPublished && portfolio.id && (
              <a
                href={`/portfolio/${portfolio.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 ease-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Live
              </a>
            )}


          </div>
        </div>

        {/* Main content area with sidebar and canvas */}
        <div className="flex w-full h-full pt-16">
          {/* Left Sidebar */}
          <div className="w-72 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto bg-white dark:bg-gray-800 shadow-sm">
            <EditorSidebar
              addSection={addSection}
              portfolio={portfolio}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              reorderSections={reorderSections}
              removeSection={removeSection}
              savePortfolio={savePortfolio}
              exportPortfolio={exportPortfolio}
              deletePortfolio={deletePortfolio}
              isSaving={isSaving}
            />
          </div>

          {/* Main Canvas - Shows responsive preview inside editor */}
          <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <EditorCanvas
              portfolio={portfolio}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              updateSection={updateSection}
              previewDevice={previewDevice}
              setPreviewDevice={setPreviewDevice}
              moveSection={moveSection}
            />
          </div>

          {/* Right Settings Panel - Includes device switcher */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto bg-white dark:bg-gray-800 shadow-sm">
            <EditorSettings
              portfolio={portfolio}
              selectedSection={selectedSection}
              updateSection={updateSection}
              updateTheme={updateTheme}
              updatePortfolioDetails={updatePortfolioDetails}
              previewDevice={previewDevice}
              setPreviewDevice={setPreviewDevice}
            />
          </div>

        </div>
      </div>
    </DndProvider>
  );

}
