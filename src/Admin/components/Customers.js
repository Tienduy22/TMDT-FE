import React, { useState } from 'react';
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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

const mockCustomers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123 456 789',
    totalOrders: 5,
    totalSpent: 8499995,
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0123 456 788',
    totalOrders: 3,
    totalSpent: 2499997,
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0123 456 787',
    totalOrders: 2,
    totalSpent: 1999998,
  },
];

const Customers = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      phone: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên khách hàng';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!/^[0-9\s-]{10,}$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
      });
    }
    setFormErrors({
      name: '',
      email: '',
      phone: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
    setFormErrors({
      name: '',
      email: '',
      phone: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (editingCustomer) {
      // Update existing customer
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingCustomer.id
            ? {
                ...customer,
                ...formData,
              }
            : customer
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật khách hàng thành công',
        severity: 'success',
      });
    } else {
      // Add new customer
      const newCustomer = {
        id: Math.max(...customers.map((c) => c.id)) + 1,
        ...formData,
        totalOrders: 0,
        totalSpent: 0,
      };
      setCustomers((prev) => [...prev, newCustomer]);
      setSnackbar({
        open: true,
        message: 'Thêm khách hàng mới thành công',
        severity: 'success',
      });
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (customerId) => {
    setDeleteCustomerId(customerId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== deleteCustomerId));
    setOpenDeleteDialog(false);
    setSnackbar({
      open: true,
      message: 'Xóa khách hàng thành công',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Khách Hàng</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm Khách Hàng
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Liên Hệ</TableCell>
              <TableCell>Số Đơn Hàng</TableCell>
              <TableCell>Tổng Chi Tiêu</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon fontSize="small" />
                      {customer.email}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon fontSize="small" />
                      {customer.phone}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell>{customer.totalSpent.toLocaleString('vi-VN')}đ</TableCell>
                <TableCell>
                  <IconButton color="error" size="small" onClick={() => handleOpenDialog(customer)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDeleteClick(customer.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCustomer ? 'Cập Nhật Khách Hàng' : 'Thêm Khách Hàng Mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="name"
              label="Tên Khách Hàng"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              fullWidth
              required
            />
            <TextField
              name="phone"
              label="Số Điện Thoại"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingCustomer ? 'Cập Nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa khách hàng này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Customers; 