import { useLocation } from 'wouter';

export function useSearchParams() {
  const [location] = useLocation();
  
  // Parse the query string
  const searchParams = new URLSearchParams(
    location.includes('?') ? location.split('?')[1] : ''
  );
  
  // Extract common parameters
  return {
    // For template preview
    templateId: searchParams.get('template') || '',
    
    // For portfolio editor
    portfolioId: searchParams.get('id') || '',
    
    // For template creation
    action: searchParams.get('action') || '',
  };
}
