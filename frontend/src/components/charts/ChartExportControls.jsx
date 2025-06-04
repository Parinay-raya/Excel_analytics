import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

const ChartExportControls = ({ chartRef, chartTitle, fileName }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportOptions, setExportOptions] = useState({
    fileName: fileName || 'chart',
    title: chartTitle || 'Chart Export'
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportOptionClick = (type) => {
    setExportType(type);
    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleOptionChange = (event) => {
    const { name, value } = event.target;
    setExportOptions({
      ...exportOptions,
      [name]: value
    });
  };

  const handleExport = async () => {
    if (!chartRef.current) {
      setSnackbar({
        open: true,
        message: 'Chart reference is not available',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // Import the chart export utilities
      const chartExport = await import('../../utils/chartExport');
      
      if (exportType === 'png') {
        await chartExport.exportElementAsPng(chartRef.current, exportOptions.fileName);
        
        setSnackbar({
          open: true,
          message: `Chart exported as PNG successfully`,
          severity: 'success'
        });
      } else if (exportType === 'pdf') {
        // PDF export is simplified to PNG with a message
        await chartExport.exportElementAsPdf(chartRef.current, exportOptions.fileName, {
          title: exportOptions.title
        });
        
        setSnackbar({
          open: true,
          message: `Chart exported as PNG (PDF export is currently unavailable)`,
          severity: 'info'
        });
      }
      
      handleDialogClose();
    } catch (error) {
      console.error('Export failed:', error);
      setSnackbar({
        open: true,
        message: `Failed to export chart: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ButtonGroup variant="outlined" size="small">
          <Button
            startIcon={<ImageIcon />}
            onClick={() => handleExportOptionClick('png')}
          >
            PNG
          </Button>
          <Button
            startIcon={<PdfIcon />}
            onClick={() => handleExportOptionClick('pdf')}
          >
            PDF
          </Button>
          <Button
            aria-controls="export-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreIcon />
          </Button>
        </ButtonGroup>
        
        <Menu
          id="export-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleExportOptionClick('png')}>
            <ListItemIcon>
              <ImageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Export as PNG" />
          </MenuItem>
          <MenuItem onClick={() => handleExportOptionClick('pdf')}>
            <ListItemIcon>
              <PdfIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Export as PDF" />
          </MenuItem>
        </Menu>
      </Box>
      
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          Export Chart as {exportType.toUpperCase()}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="File Name"
              name="fileName"
              value={exportOptions.fileName}
              onChange={handleOptionChange}
              helperText={`The file will be saved as "${exportOptions.fileName}.${exportType}"`}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Chart Title"
              name="title"
              value={exportOptions.title}
              onChange={handleOptionChange}
              helperText="Title to display in the exported file"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleExport}
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

ChartExportControls.propTypes = {
  chartRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  chartTitle: PropTypes.string,
  fileName: PropTypes.string
};

export default ChartExportControls;