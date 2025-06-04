import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const DataViewer = ({ data, columns, fileName }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('table');
  const [filteredData, setFilteredData] = useState(data);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (!value) {
      setFilteredData(data);
      return;
    }
    
    // Filter data based on search term
    const filtered = data.filter(row => {
      return Object.values(row).some(
        cellValue => 
          cellValue !== null && 
          cellValue !== undefined && 
          cellValue.toString().toLowerCase().includes(value.toLowerCase())
      );
    });
    
    setFilteredData(filtered);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredData(data);
  };

  // Calculate some basic statistics
  const getColumnStats = (columnName) => {
    const values = data
      .map(row => row[columnName])
      .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)))
      .map(val => parseFloat(val));
    
    if (values.length === 0) return { min: 'N/A', max: 'N/A', avg: 'N/A', count: 0 };
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    
    return {
      min: min.toFixed(2),
      max: max.toFixed(2),
      avg: avg.toFixed(2),
      count: values.length
    };
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Data Viewer
          {fileName && (
            <Chip 
              label={fileName} 
              size="small" 
              color="primary" 
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        
        <TextField
          size="small"
          placeholder="Search data..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ width: 250 }}
        />
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Table View" value="table" />
          <Tab label="Statistics" value="stats" />
        </Tabs>
      </Box>
      
      {activeTab === 'table' ? (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="data table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {column}
                        <IconButton size="small">
                          <FilterIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <TableRow hover key={rowIndex}>
                        {columns.map((column) => (
                          <TableCell key={`${rowIndex}-${column}`}>
                            {row[column] !== null && row[column] !== undefined ? row[column].toString() : ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      {searchTerm ? 'No matching data found' : 'No data available'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Data Statistics
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Column</TableCell>
                  <TableCell>Min</TableCell>
                  <TableCell>Max</TableCell>
                  <TableCell>Average</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {columns.map(column => {
                  const stats = getColumnStats(column);
                  return (
                    <TableRow key={column}>
                      <TableCell>{column}</TableCell>
                      <TableCell>{stats.min}</TableCell>
                      <TableCell>{stats.max}</TableCell>
                      <TableCell>{stats.avg}</TableCell>
                      <TableCell>{stats.count}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Note: Statistics are calculated only for numeric values. Text values are excluded.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

DataViewer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileName: PropTypes.string
};

export default DataViewer;