import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, Stack, Divider, Link } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

// Connection test page to verify frontend-backend connectivity
const ConnectionTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [results, setResults] = useState<{
    endpoint: string;
    status: 'success' | 'error' | 'pending';
    message: string;
    responseTime?: number;
    data?: any;
  }[]>([]);
  const [envVariables, setEnvVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get environment variables
    const env = {
      'MODE': import.meta.env.MODE || 'unknown',
      'VITE_API_URL': import.meta.env.VITE_API_URL || 'not set',
      'BASE_URL': import.meta.env.BASE_URL || 'not set',
      'PROD': import.meta.env.PROD ? 'true' : 'false',
      'DEV': import.meta.env.DEV ? 'true' : 'false',
    };
    
    setEnvVariables(env);
    
    // Determine API URL
    const determineApiUrl = () => {
      const envApiUrl = import.meta.env.VITE_API_URL;
      if (envApiUrl) {
        return envApiUrl;
      }
      
      const isProd = import.meta.env.MODE === 'production';
      
      if (isProd) {
        return 'https://drag-folio.vercel.app/api';
      }
      
      return '/api';
    };
    
    setApiUrl(determineApiUrl());
  }, []);

  const testEndpoint = async (endpoint: string) => {
    setResults(prev => [
      ...prev,
      {
        endpoint,
        status: 'pending',
        message: 'Testing connection...'
      }
    ]);
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { text: await response.text() };
      }
      
      setResults(prev => prev.map(result => 
        result.endpoint === endpoint ? {
          ...result,
          status: 'success',
          message: `Connection successful (${responseTime}ms)`,
          responseTime,
          data
        } : result
      ));
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      setResults(prev => prev.map(result => 
        result.endpoint === endpoint ? {
          ...result,
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : String(error)} (${responseTime}ms)`,
          responseTime
        } : result
      ));
    }
  };

  // Test a direct full URL endpoint
  const testDirectEndpoint = async (fullUrl: string) => {
    setResults(prev => [
      ...prev,
      {
        endpoint: fullUrl,
        status: 'pending',
        message: 'Testing direct URL...'
      }
    ]);
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { text: await response.text() };
      }
      
      setResults(prev => prev.map(result => 
        result.endpoint === fullUrl ? {
          ...result,
          status: 'success',
          message: `Direct URL successful (${responseTime}ms)`,
          responseTime,
          data
        } : result
      ));
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      setResults(prev => prev.map(result => 
        result.endpoint === fullUrl ? {
          ...result,
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : String(error)} (${responseTime}ms)`,
          responseTime
        } : result
      ));
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);
    
    // Test endpoints
    const endpoints = ['/api/templates', '/api/health', '/api/auth/status'];
    
    // Get potential backend domains from environment or use defaults for testing
    const envApiUrl = import.meta.env.VITE_API_URL || '';
    const baseApiDomain = envApiUrl.split('/api')[0];
    
    // Create a list of domains to test, starting with the environment variable if available
    const vercelDomains = [];
    
    if (baseApiDomain) {
      vercelDomains.push(baseApiDomain);
    }
    
    // Add common Vercel deployment domains as fallbacks for testing
    if (!vercelDomains.includes('https://drag-folio.vercel.app')) {
      vercelDomains.push('https://drag-folio.vercel.app');
    }
    
    // First test the current API URL
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
    }
    
    // Then test each Vercel domain directly
    for (const domain of vercelDomains) {
      for (const endpoint of endpoints) {
        const fullEndpoint = `${domain}${endpoint}`;
        await testEndpoint(fullEndpoint);
      }
    }
    
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        DragFolio Connection Test
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Environment Information
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            API URL: <code>{apiUrl}</code>
          </Typography>
        </Box>
        
        <Typography variant="subtitle2" gutterBottom>
          Environment Variables:
        </Typography>
        
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          {Object.entries(envVariables).map(([key, value]) => (
            <Typography key={key} variant="body2" component="div" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
              {key}: {value}
            </Typography>
          ))}
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={runAllTests}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Running Tests...' : 'Run Connection Tests'}
        </Button>
      </Paper>
      
      {results.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Results
          </Typography>
          
          <Stack spacing={2} divider={<Divider flexItem />}>
            {results.map((result, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {result.status === 'success' && <CheckCircleIcon color="success" sx={{ mr: 1 }} />}
                  {result.status === 'error' && <ErrorIcon color="error" sx={{ mr: 1 }} />}
                  {result.status === 'pending' && <CircularProgress size={20} sx={{ mr: 1 }} />}
                  
                  <Typography variant="subtitle1">
                    Endpoint: <code>{result.endpoint}</code>
                  </Typography>
                </Box>
                
                <Typography variant="body2" color={
                  result.status === 'success' ? 'success.main' : 
                  result.status === 'error' ? 'error.main' : 'text.secondary'
                }>
                  {result.message}
                </Typography>
                
                {result.data && (
                  <Box sx={{ mt: 1, bgcolor: '#f5f5f5', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', m: 0 }}>
                      {JSON.stringify(result.data, null, 2)}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
      
      <Box sx={{ mt: 3 }}>
        <Alert severity="info" icon={<InfoIcon />}>
          <Typography variant="body2">
            This page tests the connection between your Netlify frontend and Vercel backend. 
            If all tests pass, your deployment is configured correctly.
          </Typography>
        </Alert>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/" underline="hover">
            Return to Dashboard
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectionTest;
