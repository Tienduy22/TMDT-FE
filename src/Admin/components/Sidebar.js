import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Category as CategoriesIcon,
  AccountCircle as AccountsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const menuItems = [
  { text: 'Tổng Quan', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Sản Phẩm', icon: <InventoryIcon />, path: '/admin/products' },
  { text: 'Đơn Hàng', icon: <OrdersIcon />, path: '/admin/orders' },
  { text: 'Khách Hàng', icon: <CustomersIcon />, path: '/admin/customers' },
  { text: 'Kho Hàng', icon: <InventoryIcon />, path: '/admin/inventory' },
  { text: 'Danh Mục', icon: <CategoriesIcon />, path: '/admin/categories' },
];

const adminItems = [
  { text: 'Tài Khoản', icon: <AccountsIcon />, path: '/admin/accounts' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          mt: 8,
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />
        
        <Typography
          variant="subtitle2"
          sx={{ px: 2, py: 1, color: 'text.secondary' }}
        >
          Quản Trị
        </Typography>

        <List>
          {adminItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}

          <ListItem
            button
            onClick={handleLogout}
            sx={{
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Đăng Xuất" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 