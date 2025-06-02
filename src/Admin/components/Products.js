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
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const mockCategories = [
  { id: 1, name: 'Nhẫn' },
  { id: 2, name: 'Dây chuyền' },
  { id: 3, name: 'Bông tai' },
  { id: 4, name: 'Lắc tay' },
  { id: 5, name: 'Vòng cổ' },
];

const mockProducts = [
  {
    id: 1,
    name: 'Nhẫn Kim Cương 1 Carat',
    categoryId: 1,
    price: 29999999,
    stock: 5,
    description: 'Nhẫn kim cương 1 carat, vàng 18k, thiết kế tinh tế',
    image: 'https://example.com/diamond-ring.jpg',
    material: 'Vàng 18k'
  },
  {
    id: 2,
    name: 'Dây Chuyền Ngọc Trai',
    categoryId: 2,
    price: 4999999,
    stock: 10,
    description: 'Dây chuyền ngọc trai tự nhiên, bạc 925',
    image: 'https://example.com/pearl-necklace.jpg',
    material: 'Bạc 925'
  },
  {
    id: 3,
    name: 'Bông Tai Ruby',
    categoryId: 3,
    price: 15999999,
    stock: 3,
    description: 'Bông tai ruby đỏ, vàng 14k',
    image: 'https://example.com/ruby-earrings.jpg',
    material: 'Vàng 14k',
  },
];

const Products = () => {
  const [products, setProducts] = useState(mockProducts);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    material: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    material: ''
  });

  const validateForm = () => {
    const errors = {
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      description: '',
      image: '',
      material: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên sản phẩm';
      isValid = false;
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Vui lòng chọn danh mục';
      isValid = false;
    }

    if (!formData.price) {
      errors.price = 'Vui lòng nhập giá';
      isValid = false;
    } else if (isNaN(formData.price) || formData.price <= 0) {
      errors.price = 'Giá không hợp lệ';
      isValid = false;
    }

    if (!formData.stock) {
      errors.stock = 'Vui lòng nhập số lượng';
      isValid = false;
    } else if (isNaN(formData.stock) || formData.stock < 0) {
      errors.stock = 'Số lượng không hợp lệ';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Vui lòng nhập mô tả';
      isValid = false;
    }

    if (!formData.material.trim()) {
      errors.material = 'Vui lòng nhập chất liệu';
      isValid = false;
    }

    

    setFormErrors(errors);
    return isValid;
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        stock: product.stock,
        description: product.description,
        image: product.image,
        material: product.material
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        categoryId: '',
        price: '',
        stock: '',
        description: '',
        image: '',
        material: ''
      });
    }
    setFormErrors({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      description: '',
      image: '',
      material: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      description: '',
      image: '',
      material: ''
    });
    setFormErrors({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      description: '',
      image: '',
      material: ''
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

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
              }
            : product
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật sản phẩm thành công',
        severity: 'success',
      });
    } else {
      const newProduct = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      setProducts((prev) => [...prev, newProduct]);
      setSnackbar({
        open: true,
        message: 'Thêm sản phẩm mới thành công',
        severity: 'success',
      });
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setProducts((prev) => prev.filter((product) => product.id !== deleteProductId));
    setOpenDeleteDialog(false);
    setSnackbar({
      open: true,
      message: 'Xóa sản phẩm thành công',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getCategoryName = (categoryId) => {
    const category = mockCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : '';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Trang Sức</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm Sản Phẩm
        </Button>
      </Box>

      {/* Grid View */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image || 'https://via.placeholder.com/200'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="error" gutterBottom>
                  {product.price.toLocaleString('vi-VN')}đ
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Danh mục:</strong> {getCategoryName(product.categoryId)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Chất liệu:</strong> {product.material}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Tồn kho:</strong> {product.stock}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton color="error" size="small" onClick={() => handleOpenDialog(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDeleteClick(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Tên Sản Phẩm"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.categoryId} required>
                  <InputLabel>Danh Mục</InputLabel>
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    label="Danh Mục"
                  >
                    {mockCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.categoryId && (
                    <Typography color="error" variant="caption">
                      {formErrors.categoryId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Giá"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="stock"
                  label="Số Lượng"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  error={!!formErrors.stock}
                  helperText={formErrors.stock}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="material"
                  label="Chất Liệu"
                  value={formData.material}
                  onChange={handleInputChange}
                  error={!!formErrors.material}
                  helperText={formErrors.material}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="image"
                  label="URL Hình Ảnh"
                  value={formData.image}
                  onChange={handleInputChange}
                  error={!!formErrors.image}
                  helperText={formErrors.image}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="error">
            {editingProduct ? 'Cập Nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa sản phẩm này?</Typography>
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

export default Products; 