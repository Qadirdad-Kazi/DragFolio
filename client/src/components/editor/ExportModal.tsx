import { useState, useEffect } from 'react';
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
  Tab,
  Paper,
  Chip,
  LinearProgress,
  Fade,
  Zoom,
  IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Download as DownloadIcon,
  Check as CheckIcon,
  PictureAsPdf as PdfIcon,
  Code as CodeIcon,
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  Rocket as RocketIcon,
} from '@mui/icons-material';

// Animations
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// Styled components for enhanced UI
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    padding: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(20px)',
    color: 'white',
    maxWidth: '500px',
    width: '100%',
  },
}));

const ExportOption = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const EnhancedButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

interface ExportModalProps {
  portfolio: Portfolio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => Promise<void>;
  onExportTypeChange?: (type: 'html' | 'pdf') => void;
  currentExportType?: 'html' | 'pdf';
}

export default function ExportModal({
  // portfolio is passed but not directly used in this component
  // keeping it in props for future use if needed
  open,
  onOpenChange,
  onExport,
  onExportTypeChange,
  currentExportType = 'html'
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportTab, setExportTab] = useState<number>(0); // 0 for HTML, 1 for PDF

  // Sync export tab with current export type
  useEffect(() => {
    setExportTab(currentExportType === 'pdf' ? 1 : 0);
  }, [currentExportType]);

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
    <StyledDialog 
      open={open} 
      onClose={() => handleOpenChange(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 3,
        background: 'transparent'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <RocketIcon sx={{ fontSize: 32, color: 'white' }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
            🚀 Export Portfolio
          </Typography>
        </Box>
        <IconButton 
          onClick={() => handleOpenChange(false)}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, background: 'transparent' }}>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            fontSize: '1.1rem'
          }}
        >
          Choose how you'd like to export your portfolio
        </Typography>
        
        <Stack spacing={3}>
          {/* HTML Export Option */}
          <Fade in={true}>
            <ExportOption 
              onClick={() => {
                setExportTab(0);
                if (onExportTypeChange) {
                  onExportTypeChange('html');
                }
              }}
              sx={{ 
                border: exportTab === 0 ? '2px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: exportTab === 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  background: 'linear-gradient(45deg, #667eea, #764ba2)', 
                  borderRadius: '12px', 
                  p: 2, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CodeIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                    📄 HTML Export
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Download as a complete HTML package with all assets
                  </Typography>
                  <Chip 
                    label="Recommended" 
                    size="small" 
                    sx={{ 
                      mt: 1,
                      background: 'rgba(76, 175, 80, 0.2)',
                      color: '#4caf50',
                      border: '1px solid rgba(76, 175, 80, 0.5)'
                    }} 
                  />
                </Box>
              </Box>
            </ExportOption>
          </Fade>

          {/* PDF Export Option */}
          <Fade in={true} style={{ transitionDelay: '150ms' }}>
            <ExportOption 
              onClick={() => {
                setExportTab(1);
                if (onExportTypeChange) {
                  onExportTypeChange('pdf');
                }
              }}
              sx={{ 
                border: exportTab === 1 ? '2px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 0.2)',
                backgroundColor: exportTab === 1 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  background: 'linear-gradient(45deg, #f44336, #e91e63)', 
                  borderRadius: '12px', 
                  p: 2, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <PdfIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                    📑 PDF Export
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Generate a professional PDF document for printing
                  </Typography>
                  <Chip 
                    label="Print Ready" 
                    size="small" 
                    sx={{ 
                      mt: 1,
                      background: 'rgba(255, 152, 0, 0.2)',
                      color: '#ff9800',
                      border: '1px solid rgba(255, 152, 0, 0.5)'
                    }} 
                  />
                </Box>
              </Box>
            </ExportOption>
          </Fade>

          {/* Progress and Status */}
          {isExporting && (
            <Fade in={true}>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CircularProgress 
                  sx={{ 
                    color: 'white', 
                    mb: 2,
                    animation: `${pulse} 2s ease-in-out infinite`
                  }} 
                />
                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                  ✨ Generating your portfolio...
                </Typography>
                <LinearProgress 
                  sx={{ 
                    mt: 2, 
                    borderRadius: '4px',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #4caf50, #66bb6a)'
                    }
                  }} 
                />
              </Box>
            </Fade>
          )}

          {exportSuccess && (
            <Zoom in={true}>
              <Alert 
                severity="success" 
                sx={{ 
                  borderRadius: '12px',
                  background: 'rgba(76, 175, 80, 0.2)',
                  border: '1px solid rgba(76, 175, 80, 0.5)',
                  color: 'white',
                  animation: `${bounce} 0.5s ease-in-out`
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  🎉 Portfolio exported successfully!
                </Typography>
              </Alert>
            </Zoom>
          )}

          {error && (
            <Zoom in={true}>
              <Alert 
                severity="error"
                sx={{ 
                  borderRadius: '12px',
                  background: 'rgba(244, 67, 54, 0.2)',
                  border: '1px solid rgba(244, 67, 54, 0.5)',
                  color: 'white'
                }}
              >
                {error}
              </Alert>
            </Zoom>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, background: 'transparent' }}>
        <EnhancedButton
          onClick={() => handleOpenChange(false)}
          sx={{ 
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }
          }}
        >
          Cancel
        </EnhancedButton>
        <EnhancedButton
          onClick={handleExport}
          disabled={isExporting}
          startIcon={
            isExporting ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              <FileDownloadIcon />
            )
          }
          sx={{ 
            background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
            color: 'white',
            ml: 2,
            '&:hover': {
              background: 'linear-gradient(45deg, #388e3c, #4caf50)',
            },
            '&:disabled': {
              opacity: 0.7,
            }
          }}
        >
          {isExporting ? 'Exporting...' : `Export as ${exportTab === 0 ? 'HTML' : 'PDF'}`}
        </EnhancedButton>
      </DialogActions>
    </StyledDialog>
  );
}
