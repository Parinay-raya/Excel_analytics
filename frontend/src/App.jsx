import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { useState, useMemo, createContext } from 'react';

export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'light' });

function App() {
  // Color mode state
  const [mode, setMode] = useState(() => localStorage.getItem('colorMode') || 'light');
  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('colorMode', newMode);
        return newMode;
      });
    },
    mode,
  }), [mode]);

  // Create theme based on mode
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#fff',
      },
      secondary: {
        main: '#ff4081',
        light: '#ff80ab',
        dark: '#c51162',
        contrastText: '#fff',
      },
      background: {
        default: mode === 'dark' ? 'linear-gradient(135deg, #232526 0%, #414345 100%)' : 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        paper: mode === 'dark' ? '#23272f' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-1px' },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.5px' },
    },
    shape: { borderRadius: 18 },
    transitions: { duration: { shortest: 150, shorter: 200, short: 250, standard: 300 } },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.08)',
            transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
            fontWeight: 600,
            '&:hover': { boxShadow: '0px 4px 16px 0 rgba(25, 118, 210, 0.12)' },
          },
          containedPrimary: { '&:hover': { backgroundColor: '#1565c0' } },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: 14 } },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { boxShadow: '0px 6px 24px rgba(25, 118, 210, 0.08)', borderRadius: 18 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { borderRadius: '0 0 18px 18px', background: mode === 'dark' ? 'linear-gradient(90deg, #232526 0%, #414345 100%)' : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)' },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRadius: '0 18px 18px 0', background: mode === 'dark' ? '#23272f' : '#f5faff' },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: { paddingTop: 24, paddingBottom: 24 },
        },
      },
    },
  }), [mode]);

  // Check if user is authenticated and get their role
  let isAuthenticated = false;
  let userRole = null;
  
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    isAuthenticated = token !== null;
    userRole = user.role;
    console.log('Authentication status:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
    console.log('User role:', userRole);
  } catch (error) {
    console.error('Error checking authentication status:', error);
  }

  console.log('Rendering App component');

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            
            {/* Root route - redirect based on authentication and role */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  userRole === 'admin' ? (
                    <Navigate to="/admin-dashboard" />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            
            {/* Catch all route - redirect to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
