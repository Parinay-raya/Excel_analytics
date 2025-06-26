import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Button
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const UploadHistory = ({
  uploads = [],
  onViewData = () => {},
  onDeleteUpload = () => {},
  onRefresh = () => {},
  onDownload = () => {},
  className = ''
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Map backend uploads to expected frontend format
  const mappedUploads = (uploads || []).map(upload => ({
    id: upload._id ? String(upload._id) : (upload.id || ''),
    fileName: upload.originalName || upload.fileName || '',
    uploadDate: upload.createdAt || upload.uploadDate || '',
    fileSize: upload.size || upload.fileSize || 0,
    status: 'Processed',
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format file size f or display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Upload History</Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={onRefresh}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>
      
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="upload history table" className={className}>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedUploads.length > 0 ? (
              mappedUploads
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((upload) => (
                  <TableRow key={upload.id} hover>
                    <TableCell component="th" scope="row">
                      {upload.fileName}
                    </TableCell>
                    <TableCell>{formatDate(upload.uploadDate)}</TableCell>
                    <TableCell>{formatFileSize(upload.fileSize)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={upload.status} 
                        color={
                          upload.status === 'Processed' ? 'success' : 
                          upload.status === 'Processing' ? 'warning' : 
                          upload.status === 'Failed' ? 'error' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Data">
                        <IconButton 
                          onClick={() => onViewData(upload.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download as PDF">
                        <IconButton onClick={() => onDownload(upload.id, 'pdf')}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      {typeof onDeleteUpload === 'function' && onDeleteUpload !== null && (
                        <Tooltip title="Delete">
                          <IconButton 
                            onClick={() => onDeleteUpload(upload.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No uploads found. Upload an Excel file to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {mappedUploads.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mappedUploads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

UploadHistory.propTypes = {
  uploads: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fileName: PropTypes.string,
      uploadDate: PropTypes.string,
      fileSize: PropTypes.number,
      status: PropTypes.string
    })
  ),
  onViewData: PropTypes.func.isRequired,
  onDeleteUpload: PropTypes.func,
  onRefresh: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default UploadHistory;