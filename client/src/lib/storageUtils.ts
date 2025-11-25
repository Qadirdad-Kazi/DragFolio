/**
 * Utility functions for managing browser storage and clearing corrupted data
 */

// Known problematic portfolio IDs that should be cleared
const PROBLEMATIC_IDS = ['6920f51c9449dd1055bff59c'];

/**
 * Clear all portfolio-related data from localStorage
 */
export const clearPortfolioData = () => {
  try {
    localStorage.removeItem('editingPortfolioData');
    localStorage.removeItem('selectedTemplateData');
    localStorage.removeItem('dragfolio-theme');
    console.log('Cleared all portfolio data from localStorage');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Check if a portfolio ID is problematic and should be cleared
 */
export const isProblematicPortfolioId = (id: string): boolean => {
  return PROBLEMATIC_IDS.some(problemId => id.includes(problemId));
};

/**
 * Validate and clean portfolio data from localStorage
 */
export const validateAndCleanStoredData = () => {
  try {
    const storedData = localStorage.getItem('editingPortfolioData');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const portfolioId = parsed._id || parsed.id;
      
      if (portfolioId && isProblematicPortfolioId(portfolioId)) {
        console.log('Clearing corrupted portfolio data:', portfolioId);
        clearPortfolioData();
        return true; // Indicates data was cleared
      }
    }

    const templateData = localStorage.getItem('selectedTemplateData');
    if (templateData) {
      const parsed = JSON.parse(templateData);
      const portfolioId = parsed.id || parsed._id;
      
      if (portfolioId && isProblematicPortfolioId(portfolioId)) {
        console.log('Clearing corrupted template data:', portfolioId);
        clearPortfolioData();
        return true; // Indicates data was cleared
      }
    }
  } catch (error) {
    console.log('Error validating stored data, clearing all:', error);
    clearPortfolioData();
    return true; // Indicates data was cleared
  }
  
  return false; // No data was cleared
};

/**
 * Clean URL parameters if they contain problematic portfolio IDs
 */
export const cleanUrlParameters = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const portfolioId = urlParams.get('id');
    
    if (portfolioId && isProblematicPortfolioId(portfolioId)) {
      console.log('Cleaning problematic portfolio ID from URL:', portfolioId);
      urlParams.delete('id');
      
      // Update URL without the problematic ID
      const newUrl = urlParams.toString() 
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;
      
      window.history.replaceState({}, '', newUrl);
      return true; // Indicates URL was cleaned
    }
  } catch (error) {
    console.error('Error cleaning URL parameters:', error);
  }
  
  return false; // No URL cleaning was needed
};

/**
 * Force a complete cleanup of all portfolio-related data
 */
export const forceCleanup = () => {
  console.log('Performing force cleanup of all portfolio data...');
  
  // Clear localStorage
  clearPortfolioData();
  
  // Clean URL
  cleanUrlParameters();
  
  // Clear any other potential storage
  try {
    sessionStorage.removeItem('editingPortfolioData');
    sessionStorage.removeItem('selectedTemplateData');
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
  
  console.log('Force cleanup completed');
};