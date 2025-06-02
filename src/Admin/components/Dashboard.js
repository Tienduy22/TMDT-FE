import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
      bgcolor: color,
      color: 'white',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography component="h2" variant="h6" gutterBottom>
        {title}
      </Typography>
      {icon}
    </Box>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Tổng Quan
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng Doanh Thu"
            value="24.500.000đ"
            icon={<MoneyIcon />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Đơn Hàng"
            value="156"
            icon={<OrdersIcon />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Khách Hàng"
            value="89"
            icon={<CustomersIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sản Phẩm"
            value="245"
            icon={<InventoryIcon />}
            color="#ff9800"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
