import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/theme.css"; // Import theme styles
import { forceCleanup } from './lib/storageUtils';

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Check if it's related to the problematic portfolio ID
  if (event.reason && typeof event.reason === 'object' && 
      (event.reason.message?.includes('6920f51c9449dd1055bff59c') ||
       event.reason.toString().includes('6920f51c9449dd1055bff59c'))) {
    console.log('Detected error with problematic portfolio ID, cleaning up...');
    forceCleanup();
    // Prevent the error from showing in console
    event.preventDefault();
    // Reload the page to start fresh
    window.location.href = '/editor';
  }
});

// Global error handler for JavaScript errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Check if it's related to the problematic portfolio ID
  if (event.error && (
      event.error.message?.includes('6920f51c9449dd1055bff59c') ||
      event.filename?.includes('6920f51c9449dd1055bff59c'))) {
    console.log('Detected error with problematic portfolio ID, cleaning up...');
    forceCleanup();
    // Reload the page to start fresh
    window.location.href = '/editor';
  }
});

createRoot(document.getElementById("root")!).render(<App />);
