import React from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout; 