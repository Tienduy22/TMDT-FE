import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const mockInventory = [
  {
    id: 1,
    name: 'Nhẫn Kim Cương',
    sku: 'NK001',
    category: 'Nhẫn',
    quantity: 15,
    reorderLevel: 10,
    status: 'Còn Hàng',
  },
  {
    id: 2,
    name: 'Dây Chuyền Vàng',
    sku: 'DC001',
    category: 'Dây Chuyền',
    quantity: 8,
    reorderLevel: 15,
    status: 'Sắp Hết Hàng',
  },
  {
    id: 3,
    name: 'Bông Tai Ngọc Trai',
    sku: 'BT001',
    category: 'Bông Tai',
    quantity: 25,
    reorderLevel: 20,
    status: 'Còn Hàng',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Còn Hàng':
      return 'success';
    case 'Sắp Hết Hàng':
      return 'warning';
    case 'Hết Hàng':
      return 'error';
    default:
      return 'default';
  }
};

const Inventory = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Kho Hàng</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Thêm Sản Phẩm
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Tên Sản Phẩm</TableCell>
              <TableCell>Mã SKU</TableCell>
              <TableCell>Danh Mục</TableCell>
              <TableCell>Số Lượng</TableCell>
              <TableCell>Mức Đặt Lại</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.quantity}
                    {item.quantity <= item.reorderLevel && (
                      <WarningIcon color="warning" fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{item.reorderLevel}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Inventory;
