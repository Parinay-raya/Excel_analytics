import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from '@mui/material';
import { BarChart as BarChartIcon, BubbleChart as BubbleChartIcon, ShowChart as ShowChartIcon } from '@mui/icons-material';
import ChartExportControls from './ChartExportControls';

// Fallback 3D chart component that doesn't require external dependencies
const ThreeDimensionalCharts = ({ data, columns }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState('scatter3d');
  const [xAxisColumn, setXAxisColumn] = useState(columns[0] || '');
  const [yAxisColumn, setYAxisColumn] = useState(columns[1] || '');
  const [zAxisColumn, setZAxisColumn] = useState(columns[2] || '');

  const handleChartTypeChange = (event, newValue) => {
    setChartType(newValue);
  };

  const handleXAxisChange = (event) => {
    setXAxisColumn(event.target.value);
  };

  const handleYAxisChange = (event) => {
    setYAxisColumn(event.target.value);
  };

  const handleZAxisChange = (event) => {
    setZAxisColumn(event.target.value);
  };

  // Get sample data for display
  const getSampleData = () => {
    // Extract numeric data for the selected columns
    return data.slice(0, 10).map(row => ({
      x: parseFloat(row[xAxisColumn]) || 0,
      y: parseFloat(row[yAxisColumn]) || 0,
      z: parseFloat(row[zAxisColumn]) || 0,
      label: `${xAxisColumn}: ${row[xAxisColumn]}, ${yAxisColumn}: ${row[yAxisColumn]}, ${zAxisColumn}: ${row[zAxisColumn]}`
    }));
  };
  
  const sampleData = getSampleData();

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          3D Data Visualization
        </Typography>
        <ChartExportControls 
          chartRef={chartRef} 
          chartTitle={`${xAxisColumn} vs ${yAxisColumn} vs ${zAxisColumn} (3D ${chartType})`}
          fileName={`3d_${chartType}_${xAxisColumn}_${yAxisColumn}_${zAxisColumn}`}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="x-axis-label-3d">X-Axis</InputLabel>
            <Select
              labelId="x-axis-label-3d"
              value={xAxisColumn}
              label="X-Axis"
              onChange={handleXAxisChange}
            >
              {columns.map((column) => (
                <MenuItem key={column} value={column}>
                  {column}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="y-axis-label-3d">Y-Axis</InputLabel>
            <Select
              labelId="y-axis-label-3d"
              value={yAxisColumn}
              label="Y-Axis"
              onChange={handleYAxisChange}
            >
              {columns.map((column) => (
                <MenuItem key={column} value={column}>
                  {column}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="z-axis-label-3d">Z-Axis</InputLabel>
            <Select
              labelId="z-axis-label-3d"
              value={zAxisColumn}
              label="Z-Axis"
              onChange={handleZAxisChange}
            >
              {columns.map((column) => (
                <MenuItem key={column} value={column}>
                  {column}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={chartType} onChange={handleChartTypeChange} aria-label="3d chart types">
          <Tab icon={<BubbleChartIcon />} label="3D Scatter" value="scatter3d" />
          <Tab icon={<ShowChartIcon />} label="3D Surface" value="surface" />
          <Tab icon={<BarChartIcon />} label="3D Mesh" value="mesh3d" />
        </Tabs>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        3D visualization requires the Plotly.js library. You can install it by running:
        <Box component="pre" sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          npm install react-plotly.js plotly.js
        </Box>
      </Alert>

      <Box sx={{ height: 'auto', width: '100%', mb: 3 }} ref={chartRef}>
        <Typography variant="subtitle1" gutterBottom>
          Selected Data Preview ({chartType})
        </Typography>
        <Box sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: 1, 
          p: 2, 
          maxHeight: '300px', 
          overflowY: 'auto',
          bgcolor: '#f5f5f5'
        }}>
          <Typography variant="subtitle2" gutterBottom>
            Data points for {xAxisColumn} (X), {yAxisColumn} (Y), {zAxisColumn} (Z):
          </Typography>
          {sampleData.map((point, index) => (
            <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2">
                Point {index + 1}: X={point.x.toFixed(2)}, Y={point.y.toFixed(2)}, Z={point.z.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="contained" 
          color="primary"
          href="https://plotly.com/javascript/3d-charts/" 
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More About 3D Visualizations
        </Button>
      </Box>
    </Paper>
  );
};

ThreeDimensionalCharts.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ThreeDimensionalCharts;