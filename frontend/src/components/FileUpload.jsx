import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Box,
  Button,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an Excel file
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check if file is an Excel file
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 300);

      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response data
      const mockResponse = {
        id: 'upload_' + Date.now(),
        fileName: selectedFile.name,
        uploadDate: new Date().toISOString(),
        fileSize: selectedFile.size,
        status: 'Processed'
      };

      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess('File uploaded successfully!');
      
      // Call the success callback with the mock response
      onUploadSuccess(mockResponse);
      
      // Reset the form after a delay
      setTimeout(() => {
        setSelectedFile(null);
        setUploading(false);
        setUploadProgress(0);
        setSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError('');
    setSuccess('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Upload Excel File
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setSuccess('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {success}
        </Alert>
      )}
      
      {!selectedFile ? (
        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: '#fafafa',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            type="file"
            id="file-input"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            Drag & Drop your Excel file here
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            or
          </Typography>
          <Button
            variant="outlined"
            component="span"
            startIcon={<UploadIcon />}
          >
            Browse Files
          </Button>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Supported formats: .xlsx, .xls
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FileIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </Typography>
            <Tooltip title="Remove file">
              <IconButton onClick={handleClearFile} disabled={uploading}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {uploading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="textSecondary" align="right" sx={{ mt: 0.5 }}>
                {uploadProgress}%
              </Typography>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={uploading}
            fullWidth
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

FileUpload.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired
};

export default FileUpload;