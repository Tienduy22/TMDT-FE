import React from "react";
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


const { Search } = Input;

function onSearch(value) {
  console.log(value);
}


function Header() {

  const user = useSelector((state) => state.user)

  const dispatch = useDispatch();

  const navigate = useNavigate();

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
        <Col span={6} className="logo">
          PANDORA
        </Col>
        <Col span={8} className="search-bar">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
          />
        </Col>
        <Col span={10} className="nav-links">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/contact">Contact</a>
          <Avatar size="large" icon={<UserOutlined />} />
          {user?.fullName ? (
            <div className="account-logout">
              <div onClick={handleProfile}>{user?.fullName}</div>
              <span>|</span>
              <div onClick={handleLogout}>Logout</div>
            </div>
          ) : (
            <div className="login-register">
              <div onClick={handleNavigateLogin}>Login</div>
              <span>|</span>
              <div onClick={handleNavigateRegister}>Register</div>
            </div>
          )}

          <div className="cart-icon">
            <ShoppingCartOutlined style={{ fontSize: "26px" }} onClick={handleNavigateCart}/>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
