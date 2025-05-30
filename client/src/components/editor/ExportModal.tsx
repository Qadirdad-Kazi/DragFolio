import { useState } from 'react';
import { Portfolio } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import {
  Download as DownloadIcon,
  Check as CheckIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';

interface ExportModalProps {
  portfolio: Portfolio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => Promise<void>;
  onExportTypeChange?: (type: 'html' | 'pdf') => void;
}

export default function ExportModal({
  // portfolio is passed but not directly used in this component
  // keeping it in props for future use if needed
  open,
  onOpenChange,
  onExport,
  onExportTypeChange
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportTab, setExportTab] = useState<number>(0); // 0 for HTML, 1 for PDF

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportSuccess(false);
    
    try {
      await onExport();
      setExportSuccess(true);
    } catch (err) {
      setError('Failed to export portfolio. Please try again.');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Update export tab when changed
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setExportTab(newValue);
    // Notify parent component about export type change
    if (onExportTypeChange) {
      onExportTypeChange(newValue === 0 ? 'html' : 'pdf');
    }
  };

  // Deployment functionality removed

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setError(null);
      setExportSuccess(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => handleOpenChange(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, overflow: 'hidden' }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Export Portfolio</Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Tabs 
          value={exportTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          variant="fullWidth"
        >
          <Tab label="HTML" icon={<DownloadIcon />} iconPosition="start" sx={{ py: 2 }} />
          <Tab label="PDF" icon={<PdfIcon />} iconPosition="start" sx={{ py: 2 }} />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mb: 2 }}>
            {exportTab === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  bgcolor: 'primary.light', 
                  borderRadius: '50%', 
                  p: 1.5, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DownloadIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Export as HTML</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download your portfolio as a ZIP file containing HTML, CSS, and JavaScript files.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  bgcolor: 'primary.light', 
                  borderRadius: '50%', 
                  p: 1.5, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PdfIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Export as PDF</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download your portfolio as a PDF document, perfect for printing or sharing.
                  </Typography>
                </Box>
              </Box>
            )}
            
            {exportSuccess && (
              <Alert 
                severity="success" 
                variant="outlined"
                icon={<CheckIcon />}
                sx={{ borderRadius: 1 }}
              >
                Your portfolio has been successfully exported!
              </Alert>
            )}
            
            {error && (
              <Alert severity="error" variant="outlined" sx={{ borderRadius: 1 }}>{error}</Alert>
            )}
          </Stack>
          
          <Button 
            variant="contained"
            onClick={handleExport} 
            disabled={isExporting}
            fullWidth
            size="large"
            sx={{ 
              borderRadius: 1.5, 
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 2
            }}
            startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
          >
            {isExporting ? 'Exporting...' : exportTab === 0 ? 'Export as HTML' : 'Export as PDF'}
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ borderTop: 1, borderColor: 'divider', px: 3, py: 2 }}>
        <Button
          variant="outlined"
          onClick={() => onOpenChange(false)}
          sx={{ borderRadius: 1.5, textTransform: 'none' }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
