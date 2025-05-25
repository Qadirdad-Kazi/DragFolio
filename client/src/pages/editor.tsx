import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { portfolioApi } from '../services/api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EditorSidebar from '@/components/editor/EditorSidebar';
import EditorCanvas from '@/components/editor/EditorCanvas';
import EditorSettings from '@/components/editor/EditorSettings';
// import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getDefaultTitle, getDefaultContent, reorder } from '@/lib/utils';
import { SectionType, PortfolioSection, PortfolioTheme, Portfolio, PreviewDeviceType } from '@/types';

export default function Editor() {
  const { id: paramId } = useParams();
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Extract portfolio ID from URL query parameters
  const getPortfolioId = () => {
    // First check if we have an ID in the URL path
    if (paramId) return paramId;
    
    // Otherwise, check for ID in query parameters
    const searchParams = new URLSearchParams(
      location.includes('?') ? location.split('?')[1] : ''
    );
    return searchParams.get('id') || '';
  };
  
  const portfolioId = getPortfolioId();
  
  // State for portfolio data
  const [portfolio, setPortfolio] = useState<Portfolio>({
    title: 'My Portfolio',
    description: 'My professional portfolio',
    sections: [],
    theme: {
      mode: 'light',
      primaryColor: '#3490dc',
      secondaryColor: '#ffed4a',
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

  // Load portfolio data if editing existing portfolio
  useEffect(() => {
    if (portfolioId) {
      setIsLoading(true);
      console.log('Loading portfolio with ID:', portfolioId);
      
      portfolioApi.getById(portfolioId)
        .then(data => {
          console.log('Portfolio data loaded:', data);
          setPortfolio(data);
          // Select the first section if available
          if (data.sections && data.sections.length > 0) {
            setSelectedSection(data.sections[0].id);
          }
        })
        .catch(error => {
          console.error('Error loading portfolio:', error);
          toast({
            title: 'Error',
            description: 'Failed to load portfolio. Please try again.',
            variant: 'destructive'
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [portfolioId, toast]);

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
      let data;
      
      if (portfolioId) {
        // Update existing portfolio
        data = await portfolioApi.update(portfolioId, portfolio);
      } else {
        // Create new portfolio
        data = await portfolioApi.create(portfolio);
      }
      
      toast({
        title: 'Success',
        description: 'Portfolio saved successfully',
      });
      
      return data;
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to save portfolio. Please try again.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Export portfolio as HTML/ZIP
  const exportPortfolio = async () => {
    try {
      setIsSaving(true);
      let idToExport = portfolioId;
      
      if (!idToExport) {
        // Save first if this is a new portfolio
        const savedPortfolio = await savePortfolio();
        idToExport = savedPortfolio.id;
      }
      
      // Create a form and submit it to trigger the download
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `/api/portfolios/${idToExport}/export`;
      form.target = '_blank'; // Open in new tab to avoid navigation issues
      
      // Add a timestamp to prevent caching issues
      const timestampInput = document.createElement('input');
      timestampInput.type = 'hidden';
      timestampInput.name = 'timestamp';
      timestampInput.value = Date.now().toString();
      form.appendChild(timestampInput);
      
      // Add CSRF token if needed
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      toast({
        title: 'Export Started',
        description: 'Your portfolio export has started. The download will begin shortly.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error exporting portfolio:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your portfolio. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Deploy portfolio to subdomain
  const deployPortfolio = async (subdomain: string) => {
    try {
      setIsSaving(true);
      let portfolioIdToUse = portfolioId;
      
      if (!portfolioIdToUse) {
        const savedPortfolio = await savePortfolio();
        portfolioIdToUse = savedPortfolio.id;
      }
      
      // Use the API service instead of direct fetch
      const data = await portfolioApi.deploy(portfolioIdToUse, subdomain);
      
      toast({
        title: 'Success',
        description: `Portfolio deployed to ${data.url || 'your custom subdomain'}`,
        variant: 'default',
      });
      
      // Update the portfolio with the new subdomain if it changed
      if (portfolio.subdomain !== subdomain) {
        updatePortfolioDetails({ subdomain });
      }
      
      return data;
    } catch (error) {
      console.error('Error deploying portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to deploy portfolio. Please check if the subdomain is available.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="editor-layout flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Header with actions */}
        <div className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white truncate">
              {portfolio.title || 'Untitled Portfolio'}
            </h1>
            {isSaving && (
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                Saving...
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={savePortfolio}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            
            <button
              onClick={exportPortfolio}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Export
            </button>
            
            <button
              onClick={() => deployPortfolio(portfolio.subdomain || `portfolio-${Date.now()}`)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Publish
            </button>
          </div>
        </div>
        
        {/* Main content area with sidebar and canvas */}
        <div className="flex w-full h-full pt-14">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto bg-white dark:bg-gray-800">
            <EditorSidebar 
              addSection={addSection} 
              portfolio={portfolio}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              reorderSections={reorderSections}
              removeSection={removeSection}
              savePortfolio={savePortfolio}
              exportPortfolio={exportPortfolio}
              deployPortfolio={deployPortfolio}
              isSaving={isSaving}
            />
          </div>
          
          {/* Main Canvas */}
          <div className="flex-1 h-full overflow-y-auto">
            <EditorCanvas 
              portfolio={portfolio}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              updateSection={updateSection}
              previewDevice={previewDevice}
            />
          </div>
          
          {/* Right Settings Panel */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto bg-white dark:bg-gray-800">
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
