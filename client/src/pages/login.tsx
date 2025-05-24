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
  LockOutlined as LockOutlinedIcon 
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [_, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Login to Dragfolio
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Enter your email and password to access your account
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2">Password</Typography>
              <Link href="/forgot-password" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  Logging in...
                </>
              ) : (
                'Log in'
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
            Don't have an account?{' '}
            <Link href="/register" variant="body2" underline="hover" color="primary.main">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
