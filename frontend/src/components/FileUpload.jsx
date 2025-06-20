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
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.name.match(/\.(xlsx|xls)$/));
    if (validFiles.length !== files.length) {
      setError('Some files were not valid Excel files (.xlsx or .xls) and were ignored.');
    } else {
      setError('');
    }
    setSelectedFiles(validFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(file => file.name.match(/\.(xlsx|xls)$/));
      if (validFiles.length !== files.length) {
        setError('Some files were not valid Excel files (.xlsx or .xls) and were ignored.');
      } else {
        setError('');
      }
      setSelectedFiles(validFiles);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        // Optionally, you can add columns/rowCount if you parse the file client-side
        const token = localStorage.getItem('token');
        const res = await axios.post('/api/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        if (res.data && res.data.file) {
          onUploadSuccess(res.data.file);
        }
      }
      setUploadProgress(100);
      setSuccess('Files uploaded successfully!');
      setTimeout(() => {
        setSelectedFiles([]);
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

  const handleClearFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
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
      
      {selectedFiles.length === 0 ? (
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
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            Drag & Drop your Excel files here
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
            Supported formats: .xlsx, .xls. You can select multiple files.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          {selectedFiles.map((file, idx) => (
            <Box key={file.name + idx} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FileIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Typography>
              <Tooltip title="Remove file">
                <IconButton onClick={() => handleClearFile(idx)} disabled={uploading}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
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
            {uploading ? 'Uploading...' : 'Upload Files'}
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