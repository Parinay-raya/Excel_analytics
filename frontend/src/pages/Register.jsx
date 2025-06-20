import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import { Email, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import AuthHeader from '../components/AuthHeader';
import API_CONFIG from '../config/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!emailRegex.test(formData.email)) return setError('Please enter a valid email');
    if (!passwordRegex.test(formData.password)) {
      return setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
    }
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword)
      return setError('Please fill all fields');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.REGISTER), formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 🔁 Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard'); // assuming '/dashboard' is for regular users
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <AuthHeader title="Create your account" />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField fullWidth required label="Full Name" name="name" value={formData.name} onChange={handleChange} margin="normal" InputProps={{ startAdornment: (<InputAdornment position="start"><Person /></InputAdornment>) }} />
            <TextField fullWidth required label="Email Address" name="email" value={formData.email} onChange={handleChange} margin="normal" InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) }} />
            <TextField select fullWidth name="role" label="Select Role" value={formData.role} onChange={handleChange} SelectProps={{ native: true }} margin="normal">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required name="password" label="Password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} margin="normal" InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => togglePasswordVisibility('password')}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>), helperText: 'At least 8 characters, uppercase, lowercase, number, special character' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required name="confirmPassword" label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} margin="normal" InputProps={{
                  startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => togglePasswordVisibility('confirm')}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>)
                }} />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Create Account'}</Button>
            <Divider sx={{ my: 2 }}><Typography variant="body2">OR</Typography></Divider>
            <Typography align="center" variant="body1" sx={{ mb: 1 }}>Already have an account?</Typography>
            <Button component={RouterLink} to="/login" variant="outlined" fullWidth>Sign In</Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;

