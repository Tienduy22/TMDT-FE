import "./App.css";
import { Routes, Route } from "react-router-dom";
import { updateUser } from "./Redux/reducers/userReducer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Layout from "./Layouts";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import ProductDetail from "./Pages/ProductDetail";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import * as UserService from "./Services/userService";
import Profile from "./Pages/Profile";
import ProductCategory from "./Pages/ProductCategory";
import Cart from "./Pages/Cart";
import InfoOrder from "./Pages/InfoOrder";
import SuccessOrder from "./Pages/SuccessOrder";
import AboutPage from "./Pages/About";
import Admin from "./Pages/Admin/Layout_Admin";
import ProductAdmin from "./Pages/Admin/Product_Admin/Main";
import Product_Detail from "./Pages/Admin/Product_Admin/Detail";
import Product_Edit from "./Pages/Admin/Product_Admin/Edit";
import Product_Create from "./Pages/Admin/Product_Admin/Create";
import CategoryAdmin from "./Pages/Admin/Category_Admin/Main";
import Category_Detail from "./Pages/Admin/Category_Admin/Detail";
import Category_Create from "./Pages/Admin/Category_Admin/Create";
import Category_Edit from "./Pages/Admin/Category_Admin/Edit";
import OrderAdmin from "./Pages/Admin/Order_Admin/Main";
import Order_Detail from "./Pages/Admin/Order_Admin/Detail";
import Order_Edit from "./Pages/Admin/Order_Admin/Edit";


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    let storageData = localStorage.getItem("token")
    if(storageData){
      storageData = JSON.parse(storageData)
      const decode = jwtDecode(storageData);

      if(decode?.id){
        handleGetDetailUser(decode?.id, storageData)
      }
    }
  },[])

  // Axios Interceptor để xử lý hết hạn token và làm mới token
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      // Lấy thời gian hiện tại
      const currentTime = new Date();

      // Giải mã token để lấy thông tin về thời gian hết hạn
      let storageData = localStorage.getItem("token")
      storageData = JSON.parse(storageData)
      const decode = jwtDecode(storageData);


      // Kiểm tra xem token có hết hạn không
      if (decode.exp < currentTime.getTime() / 1000) {
        // Nếu token hết hạn, làm mới token
        const data = await UserService.RefreshToken();

        // Cập nhật header của yêu cầu với token mới
        config.headers['Authorization'] = `Bearer ${data?.token}`;
      }

      // Trả về config đã cập nhật
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailUser = async (id,token) => {
    const res = await UserService.ProfileUser(id,token)
    dispatch(updateUser({...res,token: token}))
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Product />} />
          <Route path="products/detail/:id" element={<ProductDetail />} />
          <Route path="products/:slug" element={<ProductCategory />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="info_order" element={<InfoOrder />} />
          <Route path="success-order" element={<SuccessOrder />} />
        </Route>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="product" element={<ProductAdmin />} />
          <Route path="product/detail/:product_id" element={<Product_Detail />} />
          <Route path="product/edit/:product_id" element={<Product_Edit />} />
          <Route path="product/create" element={<Product_Create />} />
          <Route path="category" element={<CategoryAdmin />} />
          <Route path="category/detail/:category_id" element={<Category_Detail />} />
          <Route path="category/create" element={<Category_Create />} />
          <Route path="category/edit/:category_id" element={<Category_Edit />} />
          <Route path="order" element={<OrderAdmin />} />
          <Route path="order/detail/:order_id" element={<Order_Detail />} />
          <Route path="order/edit/:order_id" element={<Order_Edit />} />
        </Route>
      </Routes>
      <PayPalScriptProvider options={{ "client-id": "AXcxRtCTNBAhaQdlmnuaZXwi-iybebir8vEfFwuh4793SZRoWFVmV365W173xNyEVog0ArOK8HJN1EUR" }}/>
    </>
  );
}

export default App;
