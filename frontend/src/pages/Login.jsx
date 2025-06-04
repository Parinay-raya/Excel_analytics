import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import AuthHeader from '../components/AuthHeader';
import API_CONFIG from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if we were redirected from another page
  const from = location.state?.from?.pathname || '/';
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (error) setError('');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Attempting login with:', { email: formData.email });
      
      // For development/testing purposes - simulate successful login
      // Remove this in production and uncomment the actual API call
      console.log('Using mock login for development');
      
      // Mock successful login
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: formData.email
      };
      
      // Store mock auth data
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Uncomment for actual API call
      /*
      const response = await axios.post(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.LOGIN), 
        formData
      );
      
      localStorage.setItem('token', response.data.token);
      
      // Store user info if available
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      */
      
      console.log('Login successful, redirecting to dashboard');
      // Navigate to the dashboard
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <AuthHeader title="Sign in to your account" />
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Don't have an account?
              </Typography>
              <Button
                component={RouterLink}
                to="/register"
                variant="outlined"
                fullWidth
                sx={{ py: 1 }}
              >
                Create an Account
              </Button>
            </Box>
          </Box>
        </Paper>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Excel Analytics - Analyze your data with ease
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;