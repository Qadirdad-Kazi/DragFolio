/**
 * Utility functions for exporting portfolios in various formats
 * Supports HTML and PDF exports with proper formatting
 */

/**
 * Handles the export of a portfolio with proper Content Security Policy headers
 * @param portfolioId The ID of the portfolio to export
 * @returns A Promise that resolves when the export is complete
 */
export const exportPortfolioWithCSP = async (portfolioId: string): Promise<void> => {
  try {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required for export');
    }
    
    // Create a form to submit to the export endpoint
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/api/portfolios/${portfolioId}/export`;
    
    // Add a hidden input to request CSP headers
    const cspInput = document.createElement('input');
    cspInput.type = 'hidden';
    cspInput.name = 'includeCSP';
    cspInput.value = 'true';
    form.appendChild(cspInput);
    
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
    
    // Submit the form in a new tab
    form.target = '_blank';
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    // Create an event listener to intercept the exported HTML
    window.addEventListener('message', function handleExport(event) {
      if (event.data && event.data.type === 'portfolio-export-complete') {
        // Get the HTML content
        const htmlContent = event.data.html;
        
        if (htmlContent) {
          // Modify the HTML to include CSP headers
          const modifiedHtml = addCSPHeaders(htmlContent);
          
          // Create a download link for the modified HTML
          const blob = new Blob([modifiedHtml], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = `portfolio-${portfolioId}.html`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          // Clean up
          URL.revokeObjectURL(url);
        }
        
        // Remove the event listener
        window.removeEventListener('message', handleExport);
      }
    });
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting portfolio:', error);
    return Promise.reject(error);
  }
};

/**
 * Adds Content Security Policy headers to HTML content
 * @param html The HTML content to modify
 * @returns The modified HTML content with CSP headers
 */
export const addCSPHeaders = (html: string): string => {
  // Create a CSP meta tag that allows inline scripts and styles
  const cspMetaTag = `
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:;
      style-src 'self' 'unsafe-inline' blob: data:;
      img-src 'self' data: blob: https:;
      font-src 'self' data: blob: https:;
      connect-src 'self' https:;
      frame-src 'self' https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    ">
  `;
  
  // Insert the CSP meta tag after the opening head tag
  if (html.includes('<head>')) {
    return html.replace('<head>', `<head>${cspMetaTag}`);
  } else {
    // If no head tag is found, add one
    return `<!DOCTYPE html>
<html>
<head>
  ${cspMetaTag}
</head>
${html}
</html>`;
  }
};

/**
 * Directly downloads the exported HTML with proper CSP headers
 * @param portfolioId The ID of the portfolio to export
 * @param portfolioName The name of the portfolio (for the filename)
 */
export const downloadPortfolioHtml = async (portfolioId: string, portfolioName: string): Promise<void> => {
  try {
    console.log(`Starting HTML export for portfolio ${portfolioId}`);
    
    // Generate portfolio content client-side instead of relying on API
    // First, get the portfolio data
    const portfolioResponse = await fetch(`/api/portfolios/${portfolioId}`);
    
    if (!portfolioResponse.ok) {
      throw new Error(`Failed to fetch portfolio data: ${portfolioResponse.status}`);
    }
    
    const portfolioData = await portfolioResponse.json();
    
    // Generate HTML content from the portfolio data
    const htmlContent = generatePortfolioHtml(portfolioData);
    console.log('HTML content generated, length:', htmlContent.length);
    
    // Modify the HTML to include CSP headers
    const modifiedHtml = addCSPHeaders(htmlContent);
    
    // Create a Blob with the HTML content
    const blob = new Blob([modifiedHtml], { type: 'text/html;charset=utf-8' });
    
    // Create a download URL
    const url = URL.createObjectURL(blob);
    
    // Create a meaningful filename
    const filename = portfolioName
      ? `${portfolioName.toLowerCase().replace(/\s+/g, '-')}.html`
      : `portfolio-${portfolioId}.html`;
    
    console.log(`Creating download link for ${filename}`);
    
    // Create a download link element
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    
    // Add to the document and trigger the download
    document.body.appendChild(downloadLink);
    console.log('Triggering download...');
    downloadLink.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      console.log('Download link cleaned up');
    }, 1000); // Increased timeout to ensure download starts
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error downloading portfolio HTML:', error);
    return Promise.reject(error);
  }
};

/**
 * Generates HTML content from portfolio data
 * @param portfolioData The portfolio data object
 * @returns HTML content as a string
 */
const generatePortfolioHtml = (portfolioData: any): string => {
  const { title, description, sections, theme } = portfolioData;
  
  // Create basic HTML structure
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Portfolio'}</title>
  <style>
    :root {
      --primary-color: ${theme?.primaryColor || '#2563eb'};
      --secondary-color: ${theme?.secondaryColor || '#64748b'};
      --font-family: ${theme?.fontFamily || 'Inter, sans-serif'};
      --font-size: ${theme?.fontSize || '16px'};
      --bg-color: ${theme?.mode === 'dark' ? '#1f2937' : '#ffffff'};
      --text-color: ${theme?.mode === 'dark' ? '#ffffff' : '#1f2937'};
    }
    
    body {
      font-family: var(--font-family);
      font-size: var(--font-size);
      margin: 0;
      padding: 0;
      background-color: var(--bg-color);
      color: var(--text-color);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      text-align: center;
      padding: 2rem 0;
    }
    
    h1 {
      color: var(--primary-color);
      margin-bottom: 1rem;
    }
    
    section {
      margin-bottom: 3rem;
      padding: 2rem;
      border-radius: 0.5rem;
      background-color: ${theme?.mode === 'dark' ? '#374151' : '#f9fafb'};
    }
    
    h2 {
      color: var(--primary-color);
      border-bottom: 2px solid var(--primary-color);
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .section-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .two-columns {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 768px) {
      .two-columns {
        grid-template-columns: 1fr;
      }
    }
    
    .card {
      padding: 1.5rem;
      border-radius: 0.5rem;
      background-color: ${theme?.mode === 'dark' ? '#4b5563' : '#ffffff'};
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    footer {
      text-align: center;
      padding: 2rem 0;
      color: var(--text-color);
      opacity: 0.7;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${title || 'My Portfolio'}</h1>
      <p>${description || ''}</p>
    </header>
    
    ${sections?.map((section: { type: string; title: string; layout?: string; content: any }) => `
      <section id="${section.type}">
        <h2>${section.title}</h2>
        <div class="section-content ${section.layout === 'two-columns' ? 'two-columns' : ''}">
          ${renderSectionContent(section)}
        </div>
      </section>
    `).join('') || ''}
    
    <footer>
      <p>Created with DragFolio - ${new Date().getFullYear()}</p>
    </footer>
  </div>
</body>
</html>`;
};

/**
 * Renders the content of a section based on its type
 * @param section The section data
 * @returns HTML content for the section
 */
const renderSectionContent = (section: { type: string; content: any; }): string => {
  const { type, content } = section;
  
  switch (type) {
    case 'about':
      return `
        <div class="card">
          ${content?.bio ? `<p>${content.bio}</p>` : ''}
          ${content?.image ? `<img src="${content.image}" alt="Profile" style="max-width: 100%; border-radius: 0.5rem;">` : ''}
        </div>
      `;
      
    case 'projects':
      return content?.projects?.map((project: any) => `
        <div class="card">
          <h3>${project.title || 'Project'}</h3>
          ${project.image ? `<img src="${project.image}" alt="${project.title}" style="max-width: 100%; border-radius: 0.5rem; margin-bottom: 1rem;">` : ''}
          <p>${project.description || ''}</p>
          ${project.technologies && project.technologies.length > 0 ? 
            `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
              ${project.technologies.map((tech: string) => 
                `<span style="background-color: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">${tech}</span>`
              ).join('')}
            </div>` : ''
          }
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" style="color: var(--primary-color);">GitHub</a>` : ''}
            ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" style="color: var(--primary-color);">Live Demo</a>` : ''}
          </div>
        </div>
      `).join('') || '';
      
    case 'skills':
      return `
        <div class="card">
          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            ${content?.skills?.map((skill: any) => `
              <div style="background-color: var(--primary-color); color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-bottom: 0.5rem;">
                <strong>${skill.name || 'Skill'}</strong> ${skill.level ? `- ${skill.level}` : ''}
              </div>
            `).join('') || ''}
          </div>
        </div>
      `;
      
    // Add more section types as needed
    
    default:
      return `<div class="card"><p>Content for ${type} section</p></div>`;
  }
};

/**
 * Exports the portfolio as a PDF document using direct PDF generation
 * @param portfolioId The ID of the portfolio to export
 * @param portfolioName The name of the portfolio (for the filename)
 */
export const downloadPortfolioPdf = async (portfolioId: string, portfolioName: string): Promise<void> => {
  console.log(`Starting PDF export for portfolio ${portfolioId}`);
  try {
    // Get the portfolio data directly
    const portfolioResponse = await fetch(`/api/portfolios/${portfolioId}`);
    
    if (!portfolioResponse.ok) {
      throw new Error(`Failed to fetch portfolio data: ${portfolioResponse.status}`);
    }
    
    const portfolioData = await portfolioResponse.json();
    console.log('Portfolio data retrieved for PDF generation');
    
    // Import and use jsPDF directly
    try {
      console.log('Attempting to load jsPDF...');
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF || jsPDFModule;
      console.log('jsPDF library loaded successfully', typeof jsPDF);
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      console.log('PDF document created successfully');
      
      // Set up the document
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = 20;
      
      // Add title
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      const title = portfolioData.title || 'Portfolio';
      doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Add description if available
      if (portfolioData.description) {
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        doc.text(portfolioData.description, pageWidth / 2, yPosition, { align: 'center', maxWidth: contentWidth });
        yPosition += 15;
      }
      
      // Add sections
      if (portfolioData.sections && portfolioData.sections.length > 0) {
        for (const section of portfolioData.sections) {
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Add section title
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.text(section.title, margin, yPosition);
          yPosition += 10;
          
          // Add horizontal line
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
          
          // Add section content based on type
          switch (section.type) {
            case 'about':
              if (section.content?.bio) {
                doc.setFontSize(12);
                doc.setTextColor(80, 80, 80);
                const bioLines = doc.splitTextToSize(section.content.bio, contentWidth);
                doc.text(bioLines, margin, yPosition);
                yPosition += (bioLines.length * 7) + 10;
              }
              break;
              
            case 'skills':
              if (section.content?.skills && section.content.skills.length > 0) {
                doc.setFontSize(12);
                let skillText = '';
                section.content.skills.forEach((skill: any) => {
                  skillText += `• ${skill.name}${skill.level ? ` (${skill.level})` : ''}\n`;
                });
                const skillLines = doc.splitTextToSize(skillText, contentWidth);
                doc.text(skillLines, margin, yPosition);
                yPosition += (skillLines.length * 7) + 10;
              }
              break;
              
            case 'projects':
              if (section.content?.projects && section.content.projects.length > 0) {
                doc.setFontSize(12);
                for (const project of section.content.projects) {
                  // Check if we need a new page
                  if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                  }
                  
                  doc.setFontSize(14);
                  doc.setTextColor(0, 0, 0);
                  doc.text(project.title || 'Project', margin, yPosition);
                  yPosition += 7;
                  
                  if (project.description) {
                    doc.setFontSize(12);
                    doc.setTextColor(80, 80, 80);
                    const descLines = doc.splitTextToSize(project.description, contentWidth);
                    doc.text(descLines, margin, yPosition);
                    yPosition += (descLines.length * 7) + 5;
                  }
                  
                  if (project.technologies && project.technologies.length > 0) {
                    doc.setFontSize(10);
                    doc.setTextColor(100, 100, 100);
                    doc.text(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition);
                    yPosition += 10;
                  }
                  
                  yPosition += 5; // Space between projects
                }
              }
              break;
              
            // Add more section types as needed
              
            default:
              doc.setFontSize(12);
              doc.setTextColor(80, 80, 80);
              doc.text(`Content for ${section.type} section`, margin, yPosition);
              yPosition += 10;
          }
          
          yPosition += 10; // Space between sections
        }
      }
      
      // Add footer
      const footerText = `Created with DragFolio - ${new Date().getFullYear()}`;
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      
      // Create a filename
      const filename = portfolioName
        ? `${portfolioName.toLowerCase().replace(/\s+/g, '-')}.pdf`
        : `portfolio-${portfolioId}.pdf`;
      
      console.log(`Saving PDF as: ${filename}`);
      
      // Save the PDF
      try {
        doc.save(filename);
        console.log('PDF saved successfully');
        return Promise.resolve();
      } catch (saveError) {
        console.error('Error saving PDF:', saveError);
        throw saveError;
      }
    } catch (jsPdfError) {
      console.error('Error with jsPDF library:', jsPdfError);
      console.log('jsPDF failed, but NOT falling back to HTML method');
      // Instead of falling back to HTML, throw the error so user knows PDF failed
      throw new Error(`PDF generation failed: ${jsPdfError.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return Promise.reject(error);
  }
};

/**
 * Fallback method for PDF export using browser print dialog
 * @param portfolioId The ID of the portfolio to export
 * @param portfolioName The name of the portfolio (for the filename)
 */
async function fallbackPdfExport(portfolioId: string, portfolioName: string): Promise<void> {
  try {
    console.log('Using fallback PDF export method');
    // Get the portfolio data
    const portfolioResponse = await fetch(`/api/portfolios/${portfolioId}`);
    
    if (!portfolioResponse.ok) {
      throw new Error(`Failed to fetch portfolio data: ${portfolioResponse.status}`);
    }
    
    const portfolioData = await portfolioResponse.json();
    
    // Generate HTML content from the portfolio data
    const htmlContent = generatePortfolioHtml(portfolioData);
    
    // Modify the HTML to include CSP headers and optimize for PDF
    const modifiedHtml = addCSPHeaders(optimizeForPdf(htmlContent));
    
    // Create a new iframe to render the HTML for PDF conversion
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '1024px'; // Standard width for PDF
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.opacity = '0.01';
    document.body.appendChild(iframe);
    
    // Set up the iframe content
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Failed to access iframe document');
    }
    
    iframeDoc.open();
    iframeDoc.write(modifiedHtml);
    iframeDoc.close();
    
    // Wait for all resources to load
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          iframe.style.height = '100%';
          iframe.focus();
          console.log('Opening print dialog for PDF export...');
          
          // Create a name for the PDF document
          const filename = portfolioName
            ? `${portfolioName.toLowerCase().replace(/\s+/g, '-')}.pdf`
            : `portfolio-${portfolioId}.pdf`;
          console.log(`Preparing PDF export: ${filename}`);
          
          // Add print styles to the iframe
          const style = iframeDoc.createElement('style');
          style.textContent = `
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page {
                size: A4;
                margin: 0.5cm;
              }
            }
          `;
          iframeDoc.head.appendChild(style);
          
          // Trigger print dialog
          if (iframe.contentWindow) {
            iframe.contentWindow.print();
            console.log('Print dialog opened');
            
            // Show alert to guide the user
            alert('Please select "Save as PDF" in the print dialog to download your portfolio as PDF.');
            
            // Clean up after a delay
            setTimeout(() => {
              document.body.removeChild(iframe);
              resolve();
            }, 2000);
          } else {
            console.error('Could not access iframe content window');
            document.body.removeChild(iframe);
            reject(new Error('Could not access iframe content window'));
          }
        } catch (printError) {
          console.error('Error during PDF printing:', printError);
          document.body.removeChild(iframe);
          reject(printError);
        }
      }, 1000);
    });
  } catch (error) {
    console.error('Error in fallback PDF export:', error);
    return Promise.reject(error);
  }
};

/**
 * Optimizes HTML content for PDF export
 * @param html The HTML content to optimize
 * @returns The optimized HTML content
 */
const optimizeForPdf = (html: string): string => {
  // Add print-specific styles
  const printStyles = `
    <style>
      @media print {
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.5;
          color: #000;
          background-color: #fff;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        a {
          text-decoration: underline;
          color: #000;
        }
        img, svg {
          max-width: 100% !important;
          page-break-inside: avoid;
        }
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
          page-break-inside: avoid;
        }
        table, figure {
          page-break-inside: avoid;
        }
        @page {
          size: A4;
          margin: 1cm;
        }
      }
    </style>
  `;
  
  // Insert print styles after the opening head tag
  if (html.includes('<head>')) {
    return html.replace('<head>', `<head>${printStyles}`);
  } else {
    // If no head tag is found, add one
    return `<!DOCTYPE html>
<html>
<head>
  ${printStyles}
</head>
${html}
</html>`;
  }
};
