import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
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
  MenuItem
} from '@mui/material';
import ChartExportControls from './ChartExportControls';

// Sample colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TwoDimensionalCharts = ({ data, columns }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState('line');
  const [xAxisColumn, setXAxisColumn] = useState(columns[0] || '');
  const [yAxisColumn, setYAxisColumn] = useState(columns[1] || '');

  const handleChartTypeChange = (event, newValue) => {
    setChartType(newValue);
  };

  const handleXAxisChange = (event) => {
    setXAxisColumn(event.target.value);
  };

  const handleYAxisChange = (event) => {
    setYAxisColumn(event.target.value);
  };

  // Prepare data for charts
  const chartData = data.map(row => ({
    name: row[xAxisColumn]?.toString() || 'N/A',
    value: parseFloat(row[yAxisColumn]) || 0
  }));

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          2D Data Visualization
        </Typography>
        <ChartExportControls 
          chartRef={chartRef} 
          chartTitle={`${yAxisColumn} by ${xAxisColumn} (${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart)`}
          fileName={`${chartType}_chart_${xAxisColumn}_${yAxisColumn}`}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="x-axis-label">X-Axis</InputLabel>
            <Select
              labelId="x-axis-label"
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
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="y-axis-label">Y-Axis</InputLabel>
            <Select
              labelId="y-axis-label"
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
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={chartType} onChange={handleChartTypeChange} aria-label="chart types">
          <Tab label="Line" value="line" />
          <Tab label="Bar" value="bar" />
          <Tab label="Pie" value="pie" />
          <Tab label="Area" value="area" />
        </Tabs>
      </Box>

      <Box sx={{ height: 400 }} ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name={yAxisColumn} />
            </LineChart>
          ) : chartType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name={yAxisColumn} />
            </BarChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" name={yAxisColumn} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

TwoDimensionalCharts.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default TwoDimensionalCharts;