import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { Row, Col } from "antd";
import { Input } from "antd";
import { Avatar } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../Services/userService"
import { remoteUser } from "../../Redux/reducers/userReducer";
import * as cartService from "../../Services/cartService";
import { jwtDecode } from "jwt-decode";

const { Search } = Input;

function onSearch(value) {
  console.log(value);
}

function Header() {
  const user = useSelector((state) => state.user);
  const orderItems = useSelector((state) => state.order.orderItems);
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy thông tin giỏ hàng từ API
  const fetchCartItems = async () => {
    if (user.token) {
      try {
        const user_id = jwtDecode(user.token).id;
        const res = await cartService.cartGet(user_id);
        if (res.cart && res.cart.products) {
          setCartItems(res.cart.products);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user.token]);

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const totalItems = user.token 
    ? cartItems.reduce((total, item) => total + item.amount, 0)
    : orderItems.reduce((total, item) => total + item.amount, 0);

  const handleNavigateLogin = () => {
    navigate("/login")
  }

  const handleNavigateRegister = () => {
    navigate("/register")
  }

  const handleLogout = async () => {
    await UserService.LogoutUser()
    localStorage.clear('token')
    dispatch(remoteUser())
    setCartItems([]); // Reset cart items when logout
  }

  const handleProfile = () => {
    navigate("/profile")
  }

  const handleNavigateCart = () => {
    navigate("/cart")
  }
  
  return (
    <div className="header">
      <Row>
        <Col span={4} className="logo">
          PANDORA
        </Col>
        <Col span={8} className="search-bar">
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            onSearch={onSearch}
            enterButton
          />
        </Col>
        <Col span={12} className="nav-links">
          <a href="/">Trang chủ</a>
          <a href="/products">Sản phẩm</a>
          <a href="/contact">Liên hệ</a>
          <Avatar size="large" icon={<UserOutlined />} />
          {user?.fullName ? (
            <div className="account-logout">
              <div onClick={handleProfile}>{user?.fullName}</div>
              <span>|</span>
              <div onClick={handleLogout}>Đăng xuất</div>
            </div>
          ) : (
            <div className="login-register">
              <div onClick={handleNavigateLogin}>Đăng nhập</div>
              <span>|</span>
              <div onClick={handleNavigateRegister}>Đăng ký</div>
            </div>
          )}

          <div className="cart-icon">
            <ShoppingCartOutlined style={{ fontSize: "26px" }} onClick={handleNavigateCart}/>
            {totalItems > 0 && (
              <span className="cart-count">{totalItems}</span>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
