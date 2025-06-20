import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
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

  // Prepare data for Plotly
  const getPlotlyData = () => {
    const x = data.map(row => parseFloat(row[xAxisColumn]) || 0);
    const y = data.map(row => parseFloat(row[yAxisColumn]) || 0);
    const z = data.map(row => parseFloat(row[zAxisColumn]) || 0);
    if (chartType === 'scatter3d') {
      return [{
        x,
        y,
        z,
        mode: 'markers',
        type: 'scatter3d',
        marker: { size: 5, color: z, colorscale: 'Viridis', opacity: 0.8 },
        text: data.map((row, i) => `${xAxisColumn}: ${x[i]}, ${yAxisColumn}: ${y[i]}, ${zAxisColumn}: ${z[i]}`),
        hoverinfo: 'text'
      }];
    } else if (chartType === 'surface') {
      // For surface, z must be a 2D array. We'll try to reshape if possible.
      // If not possible, fallback to scatter3d.
      const size = Math.floor(Math.sqrt(z.length));
      if (size > 1) {
        const z2d = [];
        for (let i = 0; i < size; i++) {
          z2d.push(z.slice(i * size, (i + 1) * size));
        }
        return [{
          z: z2d,
          type: 'surface',
          colorscale: 'Viridis',
        }];
      } else {
        return [{
          x,
          y,
          z,
          mode: 'markers',
          type: 'scatter3d',
          marker: { size: 5, color: z, colorscale: 'Viridis', opacity: 0.8 },
        }];
      }
    } else if (chartType === 'mesh3d') {
      return [{
        x,
        y,
        z,
        type: 'mesh3d',
        opacity: 0.5,
        color: 'rgba(100,200,200,0.5)',
      }];
    }
    return [];
  };

  const plotlyData = getPlotlyData();

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
        <Tabs value={chartType} onChange={(e, v) => setChartType(v)} aria-label="3d chart types">
          <Tab icon={<BubbleChartIcon />} label="3D Scatter" value="scatter3d" />
          <Tab icon={<ShowChartIcon />} label="3D Surface" value="surface" />
          <Tab icon={<BarChartIcon />} label="3D Mesh" value="mesh3d" />
        </Tabs>
      </Box>

      <Box sx={{ height: 500, width: '100%', mb: 3 }} ref={chartRef}>
        <Plot
          data={plotlyData}
          layout={{
            autosize: true,
            height: 450,
            margin: { l: 0, r: 0, b: 0, t: 30 },
            scene: {
              xaxis: { title: xAxisColumn },
              yaxis: { title: yAxisColumn },
              zaxis: { title: zAxisColumn },
            },
            title: `${xAxisColumn} vs ${yAxisColumn} vs ${zAxisColumn}`,
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true }}
        />
      </Box>
    </Paper>
  );
};

ThreeDimensionalCharts.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ThreeDimensionalCharts;