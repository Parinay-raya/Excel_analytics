import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Fab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Add as AddIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import axios from 'axios';
import { ColorModeContext } from '../App';
import { useContext } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

// Import our custom components
import FileUpload from '../components/FileUpload';
import UploadHistory from '../components/UploadHistory';
import DataViewer from '../components/DataViewer';
import TwoDimensionalCharts from '../components/charts/TwoDimensionalCharts';
import ThreeDimensionalCharts from '../components/charts/ThreeDimensionalCharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [currentFileName, setCurrentFileName] = useState('');
  const [columns, setColumns] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showDarkModeEffect, setShowDarkModeEffect] = useState(false);
  const mainBoxRef = useRef();

  // Extract columns from data
  useEffect(() => {
    if (currentData.length > 0) {
      setColumns(Object.keys(currentData[0]));
    }
  }, [currentData]);

  // Fetch uploads from backend
  const fetchUploads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/files', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUploads(res.data.files || []);
    } catch (err) {
      setUploads([]);
      console.error('Error fetching uploads:', err);
    }
  };

  // Fetch activities from backend
  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/activity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(res.data.activities || []);
    } catch (err) {
      setActivities([]);
      console.error('Error fetching activities:', err);
    }
  };

  useEffect(() => {
    fetchUploads();
    fetchActivities();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUploadSuccess = (uploadData) => {
    fetchUploads(); // Refresh uploads after successful upload
    fetchActivities(); // Refresh activities after upload
    // For demo: create simple mock data for the uploaded file (replace with real file parsing in production)
    const newData = [
      { id: 1, name: 'Row 1', value: Math.floor(Math.random() * 100) },
      { id: 2, name: 'Row 2', value: Math.floor(Math.random() * 100) },
      { id: 3, name: 'Row 3', value: Math.floor(Math.random() * 100) }
    ];
    setCurrentData(newData);
    setCurrentFileName(uploadData.fileName);
    
    // Switch to the data view tab
    setActiveTab(1);
    
    // Hide the upload form
    setShowUploadForm(false);
  };

  const handleViewData = async (uploadId) => {
    // Find the upload
    const upload = uploads.find(u => u.id === uploadId || u._id === uploadId);
    if (upload) {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/files/${uploadId}/data`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newData = res.data.data || [];
        setCurrentData(newData);
        setCurrentFileName(upload.fileName || upload.originalName || '');
        setColumns(newData.length > 0 ? Object.keys(newData[0]) : []);
        setActiveTab(1); // Switch to the data view tab
      } catch (err) {
        setCurrentData([]);
        setColumns([]);
        alert('Failed to load file data.');
      }
    }
  };

  const handleDeleteUpload = async (uploadId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/files/${uploadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUploads();
    } catch (err) {
      alert('Failed to delete file.');
    }
  };

  const handleRefreshUploads = () => {
    fetchUploads();
  };

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm);
    if (!showUploadForm) {
      setActiveTab(0); // Switch to the dashboard tab
    }
  };

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        return JSON.parse(userString);
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
    }
    return { name: 'User', email: 'user@example.com' };
  };

  const user = getUserInfo();

  const drawerWidth = 240;

  // Download handler for UploadHistory
  const handleDownloadUpload = async (uploadId, format) => {
    try {
      const token = localStorage.getItem('token');
      // Download the file from the backend
      const res = await axios.get(`/api/files/${uploadId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      // Extract filename from content-disposition or fallback
      const contentDisposition = res.headers['content-disposition'];
      let fileName = 'downloaded_file';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) fileName = match[1];
      }
      // Create a link and trigger download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download file.');
    }
  };

  // Enhanced dark mode toggle with visual effect
  const handleDarkModeToggle = () => {
    colorMode.toggleColorMode();
    setShowDarkModeEffect(true);
    setTimeout(() => setShowDarkModeEffect(false), 1200);
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: 'primary.main' }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1" noWrap>
          {user.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" noWrap>
          {user.email}
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        <ListItem button selected={activeTab === 0} onClick={() => setActiveTab(0)}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button selected={activeTab === 1} onClick={() => setActiveTab(1)}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Data Viewer" />
        </ListItem>
        <ListItem button selected={activeTab === 2} onClick={() => setActiveTab(2)}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Upload History" />
        </ListItem>
      </List>
      
      <Divider />
      
      <List>
        <ListItem>
          <ListItemIcon>
            {colorMode.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          <ListItemText primary={colorMode.mode === 'dark' ? 'Dark Mode' : 'Light Mode'} />
          <Box component="span" sx={{ ml: 1 }}>
            <input
              type="checkbox"
              checked={colorMode.mode === 'dark'}
              onChange={handleDarkModeToggle}
              style={{ width: 40, height: 20 }}
            />
          </Box>
        </ListItem>
        <ListItem button onClick={() => setHelpOpen(true)}>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        ref={mainBoxRef}
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 },
          transition: 'background 0.7s cubic-bezier(.4,0,.2,1)',
          background: colorMode.mode === 'dark'
            ? 'radial-gradient(circle at 60% 40%, #232526 0%, #414345 100%)'
            : 'radial-gradient(circle at 60% 40%, #e0eafc 0%, #cfdef3 100%)',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {showDarkModeEffect && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeInOut 1.2s',
            }}
          >
            <Box
              sx={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                background: colorMode.mode === 'dark'
                  ? 'radial-gradient(circle, #1976d2 0%, #232526 80%, transparent 100%)'
                  : 'radial-gradient(circle, #ff4081 0%, #e0eafc 80%, transparent 100%)',
                boxShadow: colorMode.mode === 'dark'
                  ? '0 0 80px 40px #1976d2aa, 0 0 120px 60px #23252688'
                  : '0 0 80px 40px #ff4081aa, 0 0 120px 60px #e0eafc88',
                opacity: 0.7,
                animation: 'popGlow 1.2s',
              }}
            />
          </Box>
        )}
        {/* Mobile tabs for navigation */}
        {isMobile && (
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Dashboard" />
            <Tab label="Data" />
            <Tab label="History" />
          </Tabs>
        )}
        
        <Container maxWidth="xl">
          {/* Welcome message at the top */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
              Welcome, {user.name}!
            </Typography>
          </Box>

          {/* Always show Upload History section */}
          <UploadHistory 
            uploads={uploads || []}
            onViewData={handleViewData}
            onDeleteUpload={handleDeleteUpload}
            onRefresh={handleRefreshUploads}
            onDownload={handleDownloadUpload}
          />

          {/* Dashboard Tab */}
          {activeTab === 0 && (
            <>
              {/* Always show upload form on dashboard */}
              <FileUpload onUploadSuccess={handleUploadSuccess} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  Upload Excel files to visualize and analyze your data with interactive charts.
                </Typography>
              </Box>
              {/* Always show DataViewer and charts if there is data */}
              {currentData.length > 0 && (
                <>
                  <DataViewer 
                    data={currentData} 
                    columns={columns} 
                    fileName={currentFileName}
                  />
                  <TwoDimensionalCharts data={currentData} columns={columns} />
                  <ThreeDimensionalCharts data={currentData} columns={columns} />
                </>
              )}
            </>
          )}
          
          {/* Data Viewer Tab */}
          {activeTab === 1 && (
            <>
              <DataViewer 
                data={currentData} 
                columns={columns} 
                fileName={currentFileName}
              />
              
              {currentData.length > 0 && (
                <>
                  <TwoDimensionalCharts data={currentData} columns={columns} />
                  <ThreeDimensionalCharts data={currentData} columns={columns} />
                </>
              )}
            </>
          )}
        </Container>
      </Box>
      
      {/* Floating action button for upload */}
      {/* Remove FAB since upload is now in sidebar and dashboard */}

      {/* Help Dialog */}
      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>How to Use Excel Analytics</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Uploading Files</Typography>
          <Typography variant="body1" gutterBottom>
            1. Click the <b>Upload Files</b> button on your dashboard.<br/>
            2. Select one or more Excel files (.xlsx, .xls) from your computer.<br/>
            3. Click <b>Upload</b> to add them to your account.<br/>
            4. Uploaded files will appear in your <b>Upload History</b>.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Viewing and Analyzing Data</Typography>
          <Typography variant="body1" gutterBottom>
            1. In <b>Upload History</b>, click <b>View Data</b> next to a file.<br/>
            2. Explore your data in the <b>Data Viewer</b> tab.<br/>
            3. Use the <b>2D</b> and <b>3D</b> chart tabs to visualize your data.<br/>
            4. Select columns for X, Y, and Z axes to customize your charts.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Exporting Charts</Typography>
          <Typography variant="body1">
            1. Click the <b>Export</b> button above any chart.<br/>
            2. Choose <b>PNG</b> or <b>PDF</b> to download your chart.<br/>
            3. Use exported charts in reports, presentations, or share with others.
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setHelpOpen(false)} color="primary" variant="contained">Close</MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;