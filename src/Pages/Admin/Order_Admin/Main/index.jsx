import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./OrderAdmin.scss";
import * as OrderService from "../../../../Services/orderService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";

function OrderAdmin() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const permissions = TakePermissions();

    useEffect(() => {
        const OrdersGet = async () => {
            const res = await OrderService.OrderGet();
            setOrders(res.orders);
        };
        OrdersGet();
    }, []);

    const handleDelete = async (id) => {
        const res = await OrderService.OrderDelete(id);
        if (res.code === 200) {
            setOrders((prevOrder) =>
                prevOrder.filter((order) => order._id !== id)
            );
            message.success("Xóa đơn hàng thành công!");
        } else {
            message.error("Xóa đơn hàng thất bại!");
        }
    };

    return (
        <div className="order-admin">
            {permissions.includes("order_view") ? (
                <>
                    <div className="order-admin__header">
                        <h2>Quản lý đơn hàng</h2>
                    </div>
                    <div className="order-admin__search">
                        <Input
                            placeholder="Tìm kiếm đơn hàng..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </div>
                    <div className="order-grid">
                        {/* Header */}
                        <Row className="order-grid-header" gutter={0}>
                            <Col span={2}>
                                <b>STT</b>
                            </Col>
                            <Col span={5}>
                                <b>Tên khách hàng</b>
                            </Col>
                            <Col span={3}>
                                <b>Tổng tiền</b>
                            </Col>
                            <Col span={4}>
                                <b>Ngày mua</b>
                            </Col>
                            <Col span={4}>
                                <b>Trạng thái</b>
                            </Col>
                            <Col span={6}>
                                <b>Hành động</b>
                            </Col>
                        </Row>

                        {orders.length === 0 ? (
                            <Row
                                className="order-grid-row"
                                style={{ textAlign: "center" }}
                            >
                                <Col span={24}>Không có đơn hàng.</Col>
                            </Row>
                        ) : (
                            orders.map((item, index) => (
                                <Row
                                    className="order-grid-row"
                                    key={item.key}
                                    gutter={0}
                                    align="middle"
                                >
                                    <Col span={2}>{(index += 1)}</Col>
                                    <Col span={5}>{item.infoUser?.name}</Col>
                                    <Col span={3}>
                                        {item.totalPrice} đ
                                    </Col>
                                    <Col span={4}>
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </Col>
                                    <Col span={4}>{item.status || ""}</Col>
                                    <Col span={6}>
                                        <Button
                                            icon={<EyeOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/order/detail/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Xem
                                        </Button>
                                        {permissions.includes("order_edit") ? (
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/order/edit/${item._id}`
                                                    )
                                                }
                                                style={{ marginRight: 4 }}
                                            >
                                                Sửa
                                            </Button>
                                        ) : (
                                            <></>
                                        )}
                                        {permissions.includes(
                                            "order_deleted"
                                        ) ? (
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                danger
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Xóa
                                            </Button>
                                        ) : (
                                            <></>
                                        )}
                                    </Col>
                                </Row>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <>
                    <p>Không có quyền hạn</p>
                </>
            )}
        </div>
    );
}

export default OrderAdmin;
