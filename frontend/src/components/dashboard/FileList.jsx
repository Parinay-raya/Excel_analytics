import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';

// Sample data - replace with actual API call
const sampleFiles = [
  { id: 1, name: 'Sales_Report_2023.xlsx', uploadDate: '2023-10-15', size: '1.2 MB', rows: 1250, columns: 8 },
  { id: 2, name: 'Inventory_Q3.xlsx', uploadDate: '2023-09-28', size: '3.5 MB', rows: 4500, columns: 12 },
  { id: 3, name: 'Customer_Data.xlsx', uploadDate: '2023-09-10', size: '2.8 MB', rows: 3200, columns: 15 },
  { id: 4, name: 'Financial_Summary.xlsx', uploadDate: '2023-08-22', size: '0.9 MB', rows: 850, columns: 10 },
  { id: 5, name: 'Marketing_Metrics.xlsx', uploadDate: '2023-08-05', size: '1.7 MB', rows: 2100, columns: 9 },
];

const FileList = ({ onViewFile, onDeleteFile, onAnalyzeFile }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  // In a real app, you would fetch files from an API
  const [files, setFiles] = useState(sampleFiles);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteFile = (fileId) => {
    // In a real app, you would call an API to delete the file
    setLoading(true);
    setTimeout(() => {
      setFiles(files.filter(file => file.id !== fileId));
      setLoading(false);
      if (onDeleteFile) onDeleteFile(fileId);
    }, 500);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, position: 'relative' }}>
      <Typography variant="h6" gutterBottom>
        Your Excel Files
      </Typography>
      
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }}>
          <CircularProgress />
        </Box>
      )}
      
      {files.length === 0 ? (
        <Typography variant="body1" sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
          No files uploaded yet. Upload an Excel file to get started.
        </Typography>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Data Points</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((file) => (
                    <TableRow key={file.id} hover>
                      <TableCell component="th" scope="row">
                        {file.name}
                      </TableCell>
                      <TableCell>{formatDate(file.uploadDate)}</TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            size="small" 
                            label={`${file.rows} rows`} 
                            color="primary" 
                            variant="outlined" 
                          />
                          <Chip 
                            size="small" 
                            label={`${file.columns} columns`} 
                            color="secondary" 
                            variant="outlined" 
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="View Data">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => onViewFile && onViewFile(file)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Analyze">
                            <IconButton 
                              size="small" 
                              color="secondary"
                              onClick={() => onAnalyzeFile && onAnalyzeFile(file)}
                            >
                              <ChartIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton size="small" color="primary">
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={files.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default FileList;