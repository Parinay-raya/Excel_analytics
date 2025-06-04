import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Storage as StorageIcon,
  Analytics as AnalyticsIcon,
  DateRange as DateIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, subtitle, progress }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          backgroundColor: color,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Box sx={{ 
          backgroundColor: `${color}22`,
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon && React.cloneElement(icon, { sx: { color: color } })}
        </Box>
      </Box>
      
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        {value}
      </Typography>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
      )}
      
      {progress !== undefined && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Storage used
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: `${color}22`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
              }
            }} 
          />
        </>
      )}
    </Paper>
  );
};

const StatsSummary = () => {
  // In a real app, these values would come from an API
  const stats = {
    totalFiles: 5,
    totalAnalyses: 12,
    storageUsed: 10.1, // MB
    storageLimit: 100, // MB
    lastUpload: '2023-10-15'
  };

  const storagePercentage = Math.round((stats.storageUsed / stats.storageLimit) * 100);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="TOTAL FILES"
          value={stats.totalFiles}
          icon={<UploadIcon />}
          color="#1976d2"
          subtitle="Excel files uploaded"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="ANALYSES CREATED"
          value={stats.totalAnalyses}
          icon={<AnalyticsIcon />}
          color="#2e7d32"
          subtitle="Charts and reports"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="STORAGE"
          value={`${stats.storageUsed} MB`}
          icon={<StorageIcon />}
          color="#ed6c02"
          subtitle={`of ${stats.storageLimit} MB limit`}
          progress={storagePercentage}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="LAST UPLOAD"
          value={new Date(stats.lastUpload).toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric' 
          })}
          icon={<DateIcon />}
          color="#9c27b0"
          subtitle={`${new Date(stats.lastUpload).getFullYear()}`}
        />
      </Grid>
    </Grid>
  );
};

export default StatsSummary;