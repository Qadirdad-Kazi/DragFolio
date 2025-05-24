import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EditorSidebar from '@/components/editor/EditorSidebar';
import EditorCanvas from '@/components/editor/EditorCanvas';
import EditorSettings from '@/components/editor/EditorSettings';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getDefaultTitle, getDefaultContent, reorder } from '@/lib/utils';
import { SectionType, PortfolioSection, PortfolioTheme, Portfolio, PreviewDeviceType } from '@/types';

export default function Editor() {
  const { id } = useParams();
  const { toast } = useToast();
  
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
    if (id) {
      setIsLoading(true);
      
      fetch(`/api/portfolios/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to load portfolio');
          }
          return response.json();
        })
        .then(data => {
          setPortfolio(data);
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
  }, [id, toast]);

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
      const url = id ? `/api/portfolios/${id}` : '/api/portfolios';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(portfolio)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save portfolio');
      }
      
      const data = await response.json();
      
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
      if (!id) {
        const savedPortfolio = await savePortfolio();
        window.location.href = `/api/portfolios/${savedPortfolio.id}/export`;
      } else {
        window.location.href = `/api/portfolios/${id}/export`;
      }
    } catch (error) {
      console.error('Error exporting portfolio:', error);
    }
  };

  // Deploy portfolio to subdomain
  const deployPortfolio = async (subdomain: string) => {
    try {
      let portfolioId = id;
      
      if (!portfolioId) {
        const savedPortfolio = await savePortfolio();
        portfolioId = savedPortfolio.id;
      }
      
      const response = await fetch(`/api/portfolios/${portfolioId}/deploy`, {
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
