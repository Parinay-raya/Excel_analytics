import { Box, Typography } from '@mui/material';
import { TableChart } from '@mui/icons-material';

const AuthHeader = ({ title }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <TableChart sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Excel Analytics
        </Typography>
      </Box>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
    </Box>
  );
};

export default AuthHeader;