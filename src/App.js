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
import Contact from "./Pages/About";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import * as UserService from "./Services/userService";
import Profile from "./Pages/Profile";
import ProductCategory from "./Pages/ProductCategory";
import Cart from "./Pages/Cart";
import InfoOrder from "./Pages/InfoOrder";
import SuccessOrder from "./Pages/SuccessOrder";
import AboutPage from "./Pages/About";


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
      // Nếu có lỗi xảy ra trong quá trình request
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
      </Routes>
      <PayPalScriptProvider options={{ "client-id": "AXcxRtCTNBAhaQdlmnuaZXwi-iybebir8vEfFwuh4793SZRoWFVmV365W173xNyEVog0ArOK8HJN1EUR" }}/>
    </>
  );
}

export default App;
