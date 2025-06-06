import React, { useState } from "react";
import { Layout, Menu} from "antd";
import {
    DashboardOutlined,
    ShoppingOutlined,
    UsergroupAddOutlined,
    DoubleLeftOutlined,
    ShoppingCartOutlined,
    SettingOutlined,
    UserAddOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.scss";

const { Sider, Content } = Layout;

function Admin() {
    const navigate = useNavigate();


    return (
        <Layout className="admin-layout">
            <Sider trigger={null} width={250}>
                <div className="logo">ADMIN</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["dashboard"]}
                    onClick={({ key }) => navigate(key)}
                    items={[
                        {
                            key: "/admin",
                            icon: <DashboardOutlined />,
                            label: "Trang tổng quan",
                        },
                        {
                            key: "/admin/category",
                            icon: <UnorderedListOutlined />,
                            label: "Quản lý danh mục sản phẩm",
                        },
                        {
                            key: "/admin/product",
                            icon: <ShoppingOutlined />,
                            label: "Quản lý sản phẩm",
                        },
                        {
                            key: "/admin/order",
                            icon: <ShoppingCartOutlined />,
                            label: "Quản lý đơn hàng",
                        },
                        {
                            key: "/admin/refund",
                            icon: <DoubleLeftOutlined />,
                            label: "Quản lý đổi trả",
                        },
                        {
                            key: "/admin/customer",
                            icon: <UsergroupAddOutlined />,
                            label: "Quản lý khách hàng",
                        },
                        {
                            key: "/admin/account",
                            icon: <UserAddOutlined />,
                            label: "Quản lý tài khoản hệ thống",
                        },
                        {
                            key: "/admin/role",
                            icon: <SettingOutlined />,
                            label: "Quản lý nhóm quyền",
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Content className="admin-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default Admin;
