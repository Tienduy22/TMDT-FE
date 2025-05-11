import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layouts";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import ProductDetail from "./Pages/ProductDetail";
import Contact from "./Pages/Contact";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./Services/userService";
import { updateUser } from "./Redux/reducers/userReducer";
import axios from "axios";

function App() {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   let storageData = localStorage.getItem("token")
  //   if(storageData){
  //     storageData = JSON.parse(storageData)
  //     const decode = jwtDecode(storageData);

  //     if(decode?.id){
  //       handleGetDetailUser(decode?.id, storageData)
  //     }
  //   }
  // },[])

  // // Axios Interceptor để xử lý hết hạn token và làm mới token
  // axios.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     if (error.response && error.response.status === 403) {
  //       // Token hết hạn, làm mới token
  //       try {
  //         const refreshResponse = await UserService.RefreshToken();  // Gọi API làm mới token

  //         console.log("Refresh response:", refreshResponse);

  //         const { token: newToken } = refreshResponse.data;

  //         // Lưu lại access token mới vào localStorage
  //         localStorage.setItem('token', newToken);

  //         // Thực hiện lại yêu cầu ban đầu với token mới
  //         error.config.headers['Authorization'] = `Bearer ${newToken}`;
  //         return axios(error.config);  // Retry request with new token
  //       } catch (refreshError) {
  //         console.log('Refresh token failed', refreshError);
  //         localStorage.removeItem('token');
  //         // window.location.href = '/login';  // Điều hướng về trang đăng nhập
  //         return Promise.reject(refreshError);
  //       }
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  // const handleGetDetailUser = async (id,token) => {
  //   const res = await UserService.ProfileUser(id,token)
  //   dispatch(updateUser({...res,token: token}))
  // }
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Product />} />
        <Route path="products/detail/:id" element={<ProductDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
