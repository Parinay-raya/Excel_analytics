import { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  LinearProgress,
  Alert,
  IconButton,
  Collapse,
  Divider,
  Chip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  FilePresent as FileIcon,
  CheckCircleOutline as SuccessIcon
} from '@mui/icons-material';
import API_CONFIG from '../../config/api';
import axios from 'axios';

const FileUpload = ({ onFileUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Reset states
      setError('');
      setSuccess(false);
      setUploadProgress(0);
      
      // Validate file type
      const validTypes = ['.xlsx', '.xls', '.csv'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        setError(`Invalid file type. Please upload an Excel file (${validTypes.join(', ')})`);
        return;
      }
      
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setError('File is too large. Maximum size is 10MB.');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 100 ? 99 : newProgress;
        });
      }, 500);

      // In a real app, you would use axios to upload the file
      // const response = await axios.post(
      //   API_CONFIG.getUrl('/files/upload'),
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //       Authorization: `Bearer ${localStorage.getItem('token')}`
      //     },
      //     onUploadProgress: (progressEvent) => {
      //       const percentCompleted = Math.round(
      //         (progressEvent.loaded * 100) / progressEvent.total
      //       );
      //       setUploadProgress(percentCompleted);
      //     }
      //   }
      // );

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(true);
      
      // In a real app, you would use the response from the API
      const mockResponse = {
        id: Date.now(),
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString(),
        rows: Math.floor(Math.random() * 5000) + 500,
        columns: Math.floor(Math.random() * 15) + 5
      };
      
      // Notify parent component
      if (onFileUploaded) {
        onFileUploaded(mockResponse);
      }
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSelectedFile(null);
        setSuccess(false);
        setUploadProgress(0);
      }, 3000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Upload Excel File
      </Typography>
      
      <Collapse in={!!error}>
        <Alert 
          severity="error"
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
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      </Collapse>
      
      <Collapse in={success}>
        <Alert 
          icon={<SuccessIcon fontSize="inherit" />}
          severity="success"
          sx={{ mb: 2 }}
        >
          File uploaded successfully!
        </Alert>
      </Collapse>
      
      <Box 
        sx={{ 
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: '#fafafa',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#1976d2',
            backgroundColor: '#f0f7ff'
          }
        }}
      >
        {!selectedFile ? (
          <>
            <input
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              id="file-upload-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload-input">
              <Box sx={{ mb: 2 }}>
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Drag & Drop or Click to Upload
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: .xlsx, .xls, .csv
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maximum file size: 10MB
                </Typography>
              </Box>
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
              >
                Select File
              </Button>
            </label>
          </>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FileIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                <Typography variant="subtitle1" noWrap sx={{ maxWidth: '100%' }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </Box>
              {!uploading && !success && (
                <IconButton 
                  size="small" 
                  onClick={() => setSelectedFile(null)}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
            
            {uploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ height: 8, borderRadius: 4 }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Uploading... {Math.round(uploadProgress)}%
                </Typography>
              </Box>
            )}
            
            {!uploading && !success && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                startIcon={<UploadIcon />}
                sx={{ mt: 2 }}
              >
                Upload File
              </Button>
            )}
          </Box>
        )}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Recommended:
        </Typography>
        <Chip label="Clean data" size="small" />
        <Chip label="Headers in first row" size="small" />
        <Chip label="No merged cells" size="small" />
        <Chip label="No empty sheets" size="small" />
      </Box>
    </Paper>
  );
};

export default FileUpload;