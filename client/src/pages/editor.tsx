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

  // Update portfolio theme
  const updateTheme = (updates: Partial<PortfolioTheme>) => {
    setPortfolio(prev => ({
      ...prev,
      theme: { ...prev.theme, ...updates }
    }));
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
      if (!portfolioId) {
        // Save first if this is a new portfolio
        const savedPortfolio = await savePortfolio();
        window.location.href = `/api/portfolios/${savedPortfolio.id}/export`;
      } else {
        window.location.href = `/api/portfolios/${portfolioId}/export`;
      }
    } catch (error) {
      console.error('Error exporting portfolio:', error);
    }
  };

  // Deploy portfolio to subdomain
  const deployPortfolio = async (subdomain: string) => {
    try {
      let portfolioIdToUse = portfolioId;
      
      if (!portfolioIdToUse) {
        const savedPortfolio = await savePortfolio();
        portfolioIdToUse = savedPortfolio.id;
      }
      
      const response = await fetch(`/api/portfolios/${portfolioIdToUse}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subdomain })
      });
      
      if (!response.ok) {
        throw new Error('Failed to deploy portfolio');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Success',
        description: `Portfolio deployed to ${data.url}`,
      });
      
      return data;
    } catch (error) {
      console.error('Error deploying portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to deploy portfolio. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Note: getDefaultTitle and getDefaultContent are now imported from utils.ts

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor-layout">
        {/* Left Sidebar */}
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
        
        {/* Main Canvas */}
        <EditorCanvas 
          portfolio={portfolio}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          updateSection={updateSection}
          previewDevice={previewDevice}
        />
        
        {/* Right Settings Panel */}
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
    </DndProvider>
  );
}
