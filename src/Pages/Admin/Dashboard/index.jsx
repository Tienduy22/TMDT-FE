import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Tag,
  Avatar,
  Typography,
  Space,
  Button,
  Select,
  DatePicker
} from 'antd';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Eye,
  Star,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminDashboard = () => {
  const naigate = useNavigate()

  // Dữ liệu mẫu cho thống kê
  const statsData = {
    totalRevenue: 2850000000,
    totalOrders: 1247,
    totalCustomers: 892,
    totalProducts: 156,
    revenueGrowth: 15.3,
    orderGrowth: 8.7,
    customerGrowth: 12.1,
    productGrowth: 4.2
  };

  // Dữ liệu biểu đồ doanh thu
  const revenueData = [
    { name: 'T2', revenue: 380000000, orders: 45 },
    { name: 'T3', revenue: 420000000, orders: 52 },
    { name: 'T4', revenue: 350000000, orders: 38 },
    { name: 'T5', revenue: 480000000, orders: 61 },
    { name: 'T6', revenue: 520000000, orders: 68 },
    { name: 'T7', revenue: 450000000, orders: 55 },
    { name: 'CN', revenue: 380000000, orders: 42 }
  ];

  // Dữ liệu biểu đồ danh mục sản phẩm
  const categoryData = [
    { name: 'Nhẫn', value: 35, color: '#ff6b6b' },
    { name: 'Dây chuyền', value: 28, color: '#4ecdc4' },
    { name: 'Hoa tai', value: 20, color: '#45b7d1' },
    { name: 'Vòng tay', value: 12, color: '#96ceb4' },
    { name: 'Khác', value: 5, color: '#feca57' }
  ];

  // Dữ liệu đơn hàng gần đây
  const recentOrders = [
    {
      key: '1',
      orderId: '#DH001',
      customer: 'Nguyễn Thị Mai',
      product: 'Nhẫn kim cương 18K',
      amount: 45000000,
      status: 'completed',
      date: '2024-06-06'
    },
    {
      key: '2',
      orderId: '#DH002',
      customer: 'Trần Văn Nam',
      product: 'Dây chuyền vàng',
      amount: 28000000,
      status: 'processing',
      date: '2024-06-06'
    },
    {
      key: '3',
      orderId: '#DH003',
      customer: 'Lê Thị Hoa',
      product: 'Hoa tai ngọc trai',
      amount: 15000000,
      status: 'shipped',
      date: '2024-06-05'
    },
    {
      key: '4',
      orderId: '#DH004',
      customer: 'Phạm Minh Tuấn',
      product: 'Vòng tay bạc',
      amount: 8500000,
      status: 'pending',
      date: '2024-06-05'
    }
  ];

  // Sản phẩm bán chạy
  const topProducts = [
    {
      key: '1',
      name: 'Nhẫn kim cương Tiffany',
      sales: 89,
      revenue: 890000000,
      image: '💍'
    },
    {
      key: '2',
      name: 'Dây chuyền vàng 18K',
      sales: 67,
      revenue: 670000000,
      image: '📿'
    },
    {
      key: '3',
      name: 'Hoa tai ngọc trai Akoya',
      sales: 54,
      revenue: 432000000,
      image: '👂'
    },
    {
      key: '4',
      name: 'Vòng tay charm bạc',
      sales: 43,
      revenue: 258000000,
      image: '🔗'
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      processing: 'processing',
      shipped: 'warning',
      pending: 'default'
    };
    return colors[status];
  };

  const getStatusText = (status) => {
    const texts = {
      completed: 'Hoàn thành',
      processing: 'Đang xử lý',
      shipped: 'Đã gửi',
      pending: 'Chờ xử lý'
    };
    return texts[status];
  };

  const orderColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer'
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product'
    },
    {
      title: 'Giá trị',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatCurrency(amount)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      )
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date'
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
              📊 Trang tổng quan 
            </Title>
          </Col>
        </Row>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={statsData.totalRevenue}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarSign size={20} color="#52c41a" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={statsData.totalOrders}
              prefix={<ShoppingCart size={20} color="#1890ff" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khách hàng"
              value={statsData.totalCustomers}
              prefix={<Users size={20} color="#722ed1" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản phẩm"
              value={statsData.totalProducts}
              prefix={<Package size={20} color="#fa8c16" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="📈 Doanh thu theo ngày">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1890ff"
                  fill="url(#colorRevenue)"
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="🏷️ Phân bố danh mục">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Bảng và thống kê chi tiết */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Card title="📦 Đơn hàng gần đây" extra={<Button type="link" onClick={() => naigate("/admin/order")}>Xem tất cả</Button>}>
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        
      </Row>

    </div>
  );
};

export default AdminDashboard;