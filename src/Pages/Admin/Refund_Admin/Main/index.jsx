import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./RefundAdmin.scss";
import * as RefundService from "../../../../Services/refundService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";

function RefundAdmin() {
    const [refunds, setRefunds] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const permissions = TakePermissions();

    useEffect(() => {
        const RefundsGet = async () => {
            const res = await RefundService.RefundGet();
            setRefunds(res.refunds);
        };
        RefundsGet();
    }, []);

    const handleDelete = async (id) => {
        const res = await RefundService.RefundDelete(id);
        if (res.code === 200) {
            setRefunds((prevRefund) =>
                prevRefund.filter((refund) => refund._id !== id)
            );
            message.success("Xóa thành công!");
        } else {
            message.error("Xóa thất bại!");
        }
    };

    return (
        <div className="order-admin">
            <>
                <div className="order-admin__header">
                    <h2>Quản lý đổi trả</h2>
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
                            <b>Hình thức</b>
                        </Col>
                        <Col span={4}>
                            <b>Ngày gửi</b>
                        </Col>
                        <Col span={4}>
                            <b>Trạng thái</b>
                        </Col>
                        <Col span={6}>
                            <b>Hành động</b>
                        </Col>
                    </Row>

                    {refunds.length === 0 ? (
                        <Row
                            className="order-grid-row"
                            style={{ textAlign: "center" }}
                        >
                            <Col span={24}>Không có dữ liệu</Col>
                        </Row>
                    ) : (
                        refunds.map((item, index) => (
                            <Row
                                className="order-grid-row"
                                key={item.key}
                                gutter={0}
                                align="middle"
                            >
                                <Col span={2}>{(index += 1)}</Col>
                                <Col span={5}>{item.customerName}</Col>
                                <Col span={3}>
                                    {item.returnType}
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
                                                `/admin/refund/detail/${item._id}`
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
                                                    `/admin/refund/edit/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Sửa
                                        </Button>
                                    ) : (
                                        <></>
                                    )}
                                    {permissions.includes("order_deleted") ? (
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
        </div>
    );
}

export default RefundAdmin;
