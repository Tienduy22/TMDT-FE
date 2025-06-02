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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

const mockCustomers = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
  { id: 3, name: 'Lê Văn C' },
];

const mockProducts = [
  { id: 1, name: 'Paracetamol 500mg', price: 25000 },
  { id: 2, name: 'Vitamin C 1000mg', price: 150000 },
  { id: 3, name: 'Máy đo huyết áp', price: 850000 },
];

const mockOrders = [
  {
    id: 1,
    customerId: 1,
    date: '2024-03-15',
    status: 'completed',
    total: 175000,
    items: [
      { productId: 1, quantity: 2, price: 25000 },
      { productId: 2, quantity: 1, price: 150000 },
    ],
  },
  {
    id: 2,
    customerId: 2,
    date: '2024-03-16',
    status: 'pending',
    total: 850000,
    items: [
      { productId: 3, quantity: 1, price: 850000 },
    ],
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'pending':
      return 'Đang xử lý';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    items: [{ productId: '', quantity: 1 }],
  });
  const [formErrors, setFormErrors] = useState({
    customerId: '',
    items: [],
  });

  const validateForm = () => {
    const errors = {
      customerId: '',
      items: [],
    };
    let isValid = true;

    if (!formData.customerId) {
      errors.customerId = 'Vui lòng chọn khách hàng';
      isValid = false;
    }

    formData.items.forEach((item, index) => {
      if (!item.productId) {
        errors.items[index] = 'Vui lòng chọn sản phẩm';
        isValid = false;
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.items[index] = 'Số lượng không hợp lệ';
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleOpenDialog = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        customerId: order.customerId,
        date: order.date,
        status: order.status,
        items: order.items,
      });
    } else {
      setEditingOrder(null);
      setFormData({
        customerId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        items: [{ productId: '', quantity: 1 }],
      });
    }
    setFormErrors({
      customerId: '',
      items: [],
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrder(null);
    setFormData({
      customerId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: [{ productId: '', quantity: 1 }],
    });
    setFormErrors({
      customerId: '',
      items: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
    setFormErrors((prev) => ({
      ...prev,
      items: prev.items.map((error, i) => (i === index ? '' : error)),
    }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const product = mockProducts.find((p) => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const total = calculateTotal(formData.items);

    if (editingOrder) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === editingOrder.id
            ? {
                ...order,
                ...formData,
                total,
              }
            : order
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật đơn hàng thành công',
        severity: 'success',
      });
    } else {
      const newOrder = {
        id: Math.max(...orders.map((o) => o.id)) + 1,
        ...formData,
        total,
      };
      setOrders((prev) => [...prev, newOrder]);
      setSnackbar({
        open: true,
        message: 'Thêm đơn hàng mới thành công',
        severity: 'success',
      });
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (orderId) => {
    setDeleteOrderId(orderId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setOrders((prev) => prev.filter((order) => order.id !== deleteOrderId));
    setOpenDeleteDialog(false);
    setSnackbar({
      open: true,
      message: 'Xóa đơn hàng thành công',
      severity: 'success',
    });
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setOpenViewDialog(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getCustomerName = (customerId) => {
    const customer = mockCustomers.find((c) => c.id === customerId);
    return customer ? customer.name : '';
  };

  const getProductName = (productId) => {
    const product = mockProducts.find((p) => p.id === productId);
    return product ? product.name : '';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Đơn Hàng</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm Đơn Hàng
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Khách Hàng</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Tổng Tiền</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{getCustomerName(order.customerId)}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{order.total.toLocaleString('vi-VN')}đ</TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" onClick={() => handleViewOrder(order)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleOpenDialog(order)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDeleteClick(order.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingOrder ? 'Cập Nhật Đơn Hàng' : 'Thêm Đơn Hàng Mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormControl fullWidth error={!!formErrors.customerId} required>
              <InputLabel>Khách Hàng</InputLabel>
              <Select
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                label="Khách Hàng"
              >
                {mockCustomers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.customerId && (
                <Typography color="error" variant="caption">
                  {formErrors.customerId}
                </Typography>
              )}
            </FormControl>

            <TextField
              name="date"
              label="Ngày"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Trạng Thái</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Trạng Thái"
              >
                <MenuItem value="pending">Đang xử lý</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Sản Phẩm
            </Typography>
            {formData.items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <FormControl fullWidth error={!!formErrors.items[index]} required>
                  <InputLabel>Sản Phẩm</InputLabel>
                  <Select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    label="Sản Phẩm"
                  >
                    {mockProducts.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} - {product.price.toLocaleString('vi-VN')}đ
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.items[index] && (
                    <Typography color="error" variant="caption">
                      {formErrors.items[index]}
                    </Typography>
                  )}
                </FormControl>
                <TextField
                  label="Số Lượng"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  error={!!formErrors.items[index]}
                  required
                  sx={{ width: 120 }}
                />
                {index > 0 && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(index)}
                    sx={{ mt: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={handleAddItem}
              startIcon={<AddIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              Thêm Sản Phẩm
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingOrder ? 'Cập Nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>
        <DialogContent>
          {viewingOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <Typography>
                <strong>Mã đơn hàng:</strong> {viewingOrder.id}
              </Typography>
              <Typography>
                <strong>Khách hàng:</strong> {getCustomerName(viewingOrder.customerId)}
              </Typography>
              <Typography>
                <strong>Ngày:</strong> {viewingOrder.date}
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong>{' '}
                <Chip
                  label={getStatusText(viewingOrder.status)}
                  color={getStatusColor(viewingOrder.status)}
                  size="small"
                />
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                <strong>Sản phẩm:</strong>
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản Phẩm</TableCell>
                      <TableCell align="right">Số Lượng</TableCell>
                      <TableCell align="right">Đơn Giá</TableCell>
                      <TableCell align="right">Thành Tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {viewingOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{getProductName(item.productId)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {item.price.toLocaleString('vi-VN')}đ
                        </TableCell>
                        <TableCell align="right">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <strong>Tổng cộng:</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{viewingOrder.total.toLocaleString('vi-VN')}đ</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa đơn hàng này?</Typography>
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

export default Orders; 