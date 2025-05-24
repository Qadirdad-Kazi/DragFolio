import { useState } from 'react';
import { Portfolio } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  Alert,
  Link,
  Paper,
  Stack,
  InputBase,
  Divider
} from '@mui/material';
import {
  Download as DownloadIcon,
  Language as GlobeIcon,
  Check as CheckIcon
} from '@mui/icons-material';

interface ExportDeployModalProps {
  portfolio: Portfolio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: () => Promise<void>;
  onDeploy: (subdomain: string) => Promise<void>;
}

export default function ExportDeployModal({
  portfolio,
  open,
  onOpenChange,
  onExport,
  onDeploy
}: ExportDeployModalProps) {
  const [activeTab, setActiveTab] = useState<number>(0); // 0 for export, 1 for deploy
  const [subdomain, setSubdomain] = useState<string>(portfolio.subdomain || '');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  // Handle deployment
  const handleDeploy = async () => {
    if (!subdomain.trim()) {
      setError('Please enter a valid subdomain.');
      return;
    }
    
    setIsDeploying(true);
    setError(null);
    setDeploymentSuccess(false);
    
    try {
      await onDeploy(subdomain);
      setDeploymentSuccess(true);
    } catch (err) {
      setError('Failed to deploy portfolio. Please try again.');
      console.error('Deployment error:', err);
    } finally {
      setIsDeploying(false);
    }
  };

  // Validate subdomain
  const isValidSubdomain = (value: string) => {
    return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(value);
  };

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setError(null);
      setExportSuccess(false);
      setDeploymentSuccess(false);
    }
    onOpenChange(open);
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => handleOpenChange(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Export & Deploy Portfolio</DialogTitle>
      <DialogContent>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Export" />
          <Tab label="Deploy" />
        </Tabs>
        
        <Box role="tabpanel" hidden={activeTab !== 0}>
          {activeTab === 0 && (
            <Stack spacing={2} alignItems="center" sx={{ py: 2, textAlign: 'center' }}>
              <DownloadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h6">Export as HTML</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Download your portfolio as a ZIP file containing HTML, CSS, and JavaScript files.
                You can host these files on any web hosting service.
              </Typography>
              
              {exportSuccess && (
                <Alert severity="success" sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ mr: 1 }} />
                    Export successful!
                  </Box>
                </Alert>
              )}
              
              {error && activeTab === 0 && (
                <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
              )}
              
              <Button 
                variant="contained"
                onClick={handleExport} 
                disabled={isExporting}
                fullWidth
                startIcon={isExporting ? <CircularProgress size={16} /> : <DownloadIcon />}
              >
                {isExporting ? 'Exporting...' : 'Export as ZIP'}
              </Button>
            </Stack>
          )}
        </Box>
          
        <Box role="tabpanel" hidden={activeTab !== 1}>
          {activeTab === 1 && (
            <Stack spacing={2} sx={{ py: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <GlobeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>Deploy to Subdomain</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Deploy your portfolio to a custom subdomain on dragfolio.io.
                  Your portfolio will be available at https://[subdomain].dragfolio.io
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Subdomain</Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 0, 
                    display: 'flex', 
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="yourname"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                  />
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <Typography 
                    sx={{ 
                      bgcolor: 'action.hover', 
                      p: 1, 
                      color: 'text.secondary',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    .dragfolio.io
                  </Typography>
                </Paper>
                {subdomain && !isValidSubdomain(subdomain) && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    Subdomain can only contain lowercase letters, numbers, and hyphens. It cannot start or end with a hyphen.
                  </Typography>
                )}
              </Box>
              
              {deploymentSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ mr: 1 }} />
                    Deployment successful!
                  </Box>
                </Alert>
              )}
              
              {error && activeTab === 1 && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              )}
              
              <Button 
                variant="contained"
                onClick={handleDeploy} 
                disabled={isDeploying || !isValidSubdomain(subdomain)}
                fullWidth
                startIcon={isDeploying ? <CircularProgress size={16} /> : <GlobeIcon />}
              >
                {isDeploying ? 'Deploying...' : 'Deploy'}
              </Button>
              
              {deploymentSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography>
                    Your portfolio is now live at:{' '}
                    <Link 
                      href={`https://${subdomain}.dragfolio.io`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      fontWeight="bold"
                    >
                      https://{subdomain}.dragfolio.io
                    </Link>
                  </Typography>
                </Alert>
              )}
            </Stack>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
