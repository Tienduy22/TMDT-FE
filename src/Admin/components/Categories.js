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
  Chip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

const mockCategories = [
  { 
    id: 1, 
    name: 'Nhẫn', 
    description: 'Các loại nhẫn kim cương, vàng, bạc',
    productCount: 15,
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Dây chuyền', 
    description: 'Dây chuyền vàng, bạc, ngọc trai',
    productCount: 20,
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Bông tai', 
    description: 'Bông tai kim cương, ngọc trai, vàng',
    productCount: 12,
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Lắc tay', 
    description: 'Lắc tay vàng, bạc, đá quý',
    productCount: 8,
    status: 'active'
  },
  { 
    id: 5, 
    name: 'Vòng cổ', 
    description: 'Vòng cổ vàng, bạc, đá quý',
    productCount: 10,
    status: 'active'
  },
];

const Categories = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
  });

  const validateForm = () => {
    const errors = {
      name: '',
      description: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên danh mục';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Vui lòng nhập mô tả';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        status: 'active',
      });
    }
    setFormErrors({
      name: '',
      description: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      status: 'active',
    });
    setFormErrors({
      name: '',
      description: '',
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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                ...formData,
              }
            : category
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật danh mục thành công',
        severity: 'success',
      });
    } else {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        ...formData,
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
      setSnackbar({
        open: true,
        message: 'Thêm danh mục mới thành công',
        severity: 'success',
      });
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setCategories((prev) => prev.filter((category) => category.id !== deleteCategoryId));
    setOpenDeleteDialog(false);
    setSnackbar({
      open: true,
      message: 'Xóa danh mục thành công',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản Lý Danh Mục</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm Danh Mục
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {categories.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng số danh mục
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              {categories.filter(c => c.status === 'active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh mục đang hoạt động
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              {categories.reduce((sum, c) => sum + c.productCount, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng số sản phẩm
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="info.main">
              {Math.round(categories.reduce((sum, c) => sum + c.productCount, 0) / categories.length)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Trung bình sản phẩm/danh mục
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell align="center">Số Sản Phẩm</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell align="center">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell align="center">{category.productCount}</TableCell>
                <TableCell>
                  <Chip
                    label={category.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                    color={category.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => handleOpenDialog(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDeleteClick(category.id)}>
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
          {editingCategory ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục Mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="name"
              label="Tên Danh Mục"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              fullWidth
              required
            />
            <TextField
              name="description"
              label="Mô Tả"
              value={formData.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              fullWidth
              required
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingCategory ? 'Cập Nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa danh mục này?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Lưu ý: Việc xóa danh mục có thể ảnh hưởng đến các sản phẩm thuộc danh mục này.
          </Typography>
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

export default Categories; 