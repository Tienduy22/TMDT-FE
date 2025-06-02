import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { updateUser } from "./Redux/reducers/userReducer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Layout from "./Layouts";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import ProductDetail from "./Pages/ProductDetail";
import Contact from "./Pages/Contact";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import * as UserService from "./Services/userService";
import Profile from "./Pages/Profile";
import ProductCategory from "./Pages/ProductCategory";
import Cart from "./Pages/Cart";
import InfoOrder from "./Pages/InfoOrder";
import SuccessOrder from "./Pages/SuccessOrder";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AdminLayout from './Admin/layouts/AdminLayout';
import Dashboard from './Admin/components/Dashboard';
import Products from './Admin/components/Products';
import Orders from './Admin/components/Orders';
import Customers from './Admin/components/Customers';
import Inventory from './Admin/components/Inventory';
import Categories from './Admin/components/Categories';
import Accounts from './Admin/components/Accounts';
import AdminLogin from './Admin/components/Login';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    let storageData = localStorage.getItem("token")
    if (storageData) {
      storageData = JSON.parse(storageData)
      const decode = jwtDecode(storageData);

      if (decode?.id) {
        handleGetDetailUser(decode?.id, storageData)
      }
    }
  }, [])

  // Axios Interceptor để xử lý hết hạn token và làm mới token
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      let storageData = localStorage.getItem("token")
      storageData = JSON.parse(storageData)
      const decode = jwtDecode(storageData);

      if (decode.exp < currentTime.getTime() / 1000) {
        const data = await UserService.RefreshToken();
        config.headers['Authorization'] = `Bearer ${data?.token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.ProfileUser(id, token)
    dispatch(updateUser({ ...res, token: token }))
  }
  
  const theme = createTheme({
    palette: {
      primary: {
        main: '#f8f8f8',
      },
      secondary: {
        main: '#ffd700',
      },
    },
  });

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('adminToken');
    
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }

    return children;
  };

  return (
    <>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Product />} />
          <Route path="products/detail/:id" element={<ProductDetail />} />
          <Route path="products/:slug" element={<ProductCategory />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="info_order" element={<InfoOrder />} />
          <Route path="success-order" element={<SuccessOrder />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Customers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Inventory />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/accounts"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Accounts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <PayPalScriptProvider options={{ "client-id": "AXcxRtCTNBAhaQdlmnuaZXwi-iybebir8vEfFwuh4793SZRoWFVmV365W173xNyEVog0ArOK8HJN1EUR" }} />
    </>
  );
}

export default App;
