import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Link,
  Grid,
  Alert,
  CircularProgress,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  PersonAddOutlined as PersonAddOutlinedIcon 
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [_, navigate] = useLocation();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format error messages
  const formatErrorMessage = (errorMsg: string): string => {
    // Make error messages more user-friendly
    if (errorMsg.toLowerCase().includes('user already exists') || 
        errorMsg.toLowerCase().includes('email already exists')) {
      return 'An account with this email already exists. Please use a different email or try logging in.';
    }
    
    if (errorMsg.toLowerCase().includes('password must be at least')) {
      return 'Password is too short. Please use at least 6 characters.';
    }
    
    if (errorMsg.toLowerCase().includes('invalid email')) {
      return 'Please enter a valid email address.';
    }
    
    if (errorMsg.toLowerCase().includes('all fields are required')) {
      return 'Please fill in all required fields.';
    }
    
    if (errorMsg.toLowerCase().includes('validation error')) {
      return 'Please check your input and try again. Make sure your email is valid and password is at least 6 characters.';
    }
    
    if (errorMsg.toLowerCase().includes('network') || 
        errorMsg.toLowerCase().includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    
    // Return the original message if no specific match
    return errorMsg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Client-side validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please make sure both passwords are the same.');
      return;
    }
    
    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      // Format and show the error message
      const errorMessage = err.message || 'Failed to create account. Please try again.';
      setError(formatErrorMessage(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 8
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create an Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Enter your details to create your Dragfolio account
        </Typography>
        
        <Paper elevation={2} sx={{ p: 4, width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
              helperText={email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email address' : ''}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Password must be at least 6 characters long."
              error={password.length > 0 && password.length < 6}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword.length > 0 && password !== confirmPassword}
              helperText={confirmPassword.length > 0 && password !== confirmPassword ? 'Passwords do not match' : ''}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            
            <Box sx={{ position: 'relative', mt: 3, mb: 3 }}>
              <Divider>
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                  Or continue with
                </Typography>
              </Divider>
            </Box>
            
            <Grid container spacing={2}>
              <Grid sx={{ gridColumn: { xs: 6 } }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                >
                  Google
                </Button>
              </Grid>
              <Grid sx={{ gridColumn: { xs: 6 } }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                >
                  GitHub
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link href="/login" variant="body2" underline="hover" color="primary.main">
              Log in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
