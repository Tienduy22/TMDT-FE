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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const mockAccounts = [
  {
    id: 1,
    username: 'admin',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@example.com',
    role: 'Quản Trị Viên',
    status: 'Hoạt Động',
    lastLogin: '15/03/2024 08:30',
  },
  {
    id: 2,
    username: 'manager',
    fullName: 'Trần Thị Quản Lý',
    email: 'manager@example.com',
    role: 'Quản Lý',
    status: 'Hoạt Động',
    lastLogin: '14/03/2024 15:45',
  },
  {
    id: 3,
    username: 'staff',
    fullName: 'Lê Văn Nhân Viên',
    email: 'staff@example.com',
    role: 'Nhân Viên',
    status: 'Khóa',
    lastLogin: '13/03/2024 10:20',
  },
];

const Accounts = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: '',
    status: '',
    password: '',
  });

  const handleOpen = (account = null) => {
    if (account) {
      setEditMode(true);
      setSelectedAccount(account);
      setFormData({
        username: account.username,
        fullName: account.fullName,
        email: account.email,
        role: account.role,
        status: account.status,
        password: '',
      });
    } else {
      setEditMode(false);
      setSelectedAccount(null);
      setFormData({
        username: '',
        fullName: '',
        email: '',
        role: '',
        status: 'Hoạt Động',
        password: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: '',
      status: 'Hoạt Động',
      password: '',
    });
  };

  const handleSubmit = () => {
    // TODO: Implement save logic
    handleClose();
  };

  const handleDelete = (id) => {
    // TODO: Implement delete logic
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản Lý Tài Khoản</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm Tài Khoản
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Tên Đăng Nhập</TableCell>
              <TableCell>Họ Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai Trò</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Đăng Nhập Cuối</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.fullName}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.role}</TableCell>
                <TableCell>{account.status}</TableCell>
                <TableCell>{account.lastLogin}</TableCell>
                <TableCell>
                  <IconButton 
                    color="error" 
                    size="small"
                    onClick={() => handleOpen(account)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    size="small"
                    onClick={() => handleDelete(account.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên Đăng Nhập"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  margin="normal"
                  disabled={editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ Tên"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Vai Trò</InputLabel>
                  <Select
                    value={formData.role}
                    label="Vai Trò"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <MenuItem value="Quản Trị Viên">Quản Trị Viên</MenuItem>
                    <MenuItem value="Quản Lý">Quản Lý</MenuItem>
                    <MenuItem value="Nhân Viên">Nhân Viên</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Trạng Thái</InputLabel>
                  <Select
                    value={formData.status}
                    label="Trạng Thái"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="Hoạt Động">Hoạt Động</MenuItem>
                    <MenuItem value="Khóa">Khóa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={editMode ? 'Mật Khẩu Mới' : 'Mật Khẩu'}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  margin="normal"
                  helperText={editMode ? 'Để trống nếu không muốn thay đổi mật khẩu' : ''}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Cập Nhật' : 'Thêm Mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts; 