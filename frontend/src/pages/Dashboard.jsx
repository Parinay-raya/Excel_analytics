import { useState, useEffect } from 'react';
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
  Badge
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
  Add as AddIcon
} from '@mui/icons-material';

// Import our custom components
import FileUpload from '../components/FileUpload';
import UploadHistory from '../components/UploadHistory';
import DataViewer from '../components/DataViewer';
import TwoDimensionalCharts from '../components/charts/TwoDimensionalCharts';
import ThreeDimensionalCharts from '../components/charts/ThreeDimensionalCharts';

// Mock data for demonstration
const generateMockData = () => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 0; i < 50; i++) {
    const month = months[Math.floor(Math.random() * months.length)];
    data.push({
      id: i + 1,
      month: month,
      sales: Math.floor(Math.random() * 10000),
      profit: Math.floor(Math.random() * 5000),
      expenses: Math.floor(Math.random() * 3000),
      customers: Math.floor(Math.random() * 500),
      growth: (Math.random() * 30 - 10).toFixed(2),
      category: ['Electronics', 'Clothing', 'Food', 'Books', 'Toys'][Math.floor(Math.random() * 5)]
    });
  }
  
  return data;
};

const mockUploads = [
  {
    id: 'upload_1',
    fileName: 'sales_data_2023.xlsx',
    uploadDate: '2023-10-15T14:30:00Z',
    fileSize: 1024 * 1024 * 2.5, // 2.5 MB
    status: 'Processed'
  },
  {
    id: 'upload_2',
    fileName: 'inventory_q3.xlsx',
    uploadDate: '2023-09-22T09:15:00Z',
    fileSize: 1024 * 512, // 512 KB
    status: 'Processed'
  },
  {
    id: 'upload_3',
    fileName: 'marketing_campaign.xlsx',
    uploadDate: '2023-08-05T16:45:00Z',
    fileSize: 1024 * 1024 * 1.2, // 1.2 MB
    status: 'Processed'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [uploads, setUploads] = useState(mockUploads);
  const [currentData, setCurrentData] = useState(generateMockData());
  const [currentFileName, setCurrentFileName] = useState('sales_data_2023.xlsx');
  const [columns, setColumns] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Extract columns from data
  useEffect(() => {
    if (currentData.length > 0) {
      setColumns(Object.keys(currentData[0]));
    }
  }, [currentData]);

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
    // Add the new upload to the list
    setUploads([uploadData, ...uploads]);
    
    // Generate new mock data for the upload
    const newData = generateMockData();
    setCurrentData(newData);
    setCurrentFileName(uploadData.fileName);
    
    // Switch to the data view tab
    setActiveTab(1);
    
    // Hide the upload form
    setShowUploadForm(false);
  };

  const handleViewData = (uploadId) => {
    // Find the upload
    const upload = uploads.find(u => u.id === uploadId);
    if (upload) {
      // Generate new mock data for this upload
      const newData = generateMockData();
      setCurrentData(newData);
      setCurrentFileName(upload.fileName);
      
      // Switch to the data view tab
      setActiveTab(1);
    }
  };

  const handleDeleteUpload = (uploadId) => {
    // Filter out the deleted upload
    setUploads(uploads.filter(upload => upload.id !== uploadId));
  };

  const handleRefreshUploads = () => {
    // In a real app, this would fetch the latest uploads from the server
    console.log('Refreshing uploads...');
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
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button>
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Excel Analytics
          </Typography>
          
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Account">
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
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
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        
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
          {/* Dashboard Tab */}
          {activeTab === 0 && (
            <>
              {showUploadForm ? (
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              ) : (
                <>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                      Welcome back, {user.name}!
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Upload Excel files to visualize and analyze your data with interactive charts.
                    </Typography>
                  </Box>
                  
                  {currentData.length > 0 && (
                    <>
                      <TwoDimensionalCharts data={currentData} columns={columns} />
                      <ThreeDimensionalCharts data={currentData} columns={columns} />
                    </>
                  )}
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
          
          {/* Upload History Tab */}
          {activeTab === 2 && (
            <UploadHistory 
              uploads={uploads} 
              onViewData={handleViewData} 
              onDeleteUpload={handleDeleteUpload}
              onRefresh={handleRefreshUploads}
            />
          )}
        </Container>
      </Box>
      
      {/* Floating action button for upload */}
      <Fab 
        color="primary" 
        aria-label="upload" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={toggleUploadForm}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Dashboard;