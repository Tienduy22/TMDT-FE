import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./CategoryAdmin.scss";
import * as ProductService from "../../../../Services/productService";
import * as CategoryService from "../../../../Services/categoryService";
import { useNavigate } from "react-router-dom";

function CategoryAdmin() {
    const [categories, setCategory] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const categoryGet = async () => {
            const res = await ProductService.productCategoryGet();
            setCategory(res);
        };
        categoryGet();
    }, [categories.length]);

    const handleDelete = async (id) => {
        const res = await CategoryService.categoryDelete(id)
        if (res.code === 200) {
            setCategory((prevCategory) => prevCategory.filter(category => category._id !== id));
            message.success("Xóa sản phẩm thành công!");
        } else {
            message.error("Xóa sản phẩm thất bại!");
        }
    };


    return (
        <div className="product-admin">
            <div className="product-admin__header">
                <h2>Quản lý danh mục sản phẩm</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/category/create")}
                >
                    Thêm danh mục sản phẩm
                </Button>
            </div>
            <div className="product-admin__search">
                <Input
                    placeholder="Tìm kiếm danh mục sản phẩm..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 300 }}
                />
            </div>
            <div className="product-grid">
                {/* Header */}
                <Row className="product-grid-header" gutter={0}>
                    <Col span={2}>
                        <b>STT</b>
                    </Col>
                    <Col span={5}>
                        <b>Ảnh</b>
                    </Col>
                    <Col span={6}>
                        <b>Danh mục sản phẩm</b>
                    </Col>
                    <Col span={5}>
                        <b>Người tạo</b>
                    </Col>
                    <Col span={6}>
                        <b>Hành động</b>
                    </Col>
                </Row>

                {categories.length === 0 ? (
                    <Row
                        className="product-grid-row"
                        style={{ textAlign: "center" }}
                    >
                        <Col span={24}>Không có danh mục sản phẩm nào.</Col>
                    </Row>
                ) : (
                    categories.map((item) => (
                        <Row
                            className="product-grid-row"
                            key={item.key}
                            gutter={0}
                            align="middle"
                        >
                            <Col span={2}>{item.position}</Col>
                            <Col span={5}>
                                {item.thumbnail ? (
                                    <img
                                        src={item.thumbnail}
                                        alt="category"
                                        style={{
                                            width: 100,
                                            height: 100,
                                            objectFit: "cover",
                                            borderRadius: 6,
                                        }}
                                    />
                                ) : (
                                    <span>Không có ảnh</span>
                                )}
                            </Col>
                            <Col span={6}>{item.title}</Col>
                            <Col span={5}></Col>
                            <Col span={6}>
                                <Button
                                    icon={<EyeOutlined />}
                                    size="small"
                                    onClick={() => navigate(`/admin/category/detail/${item._id}`)}
                                    style={{ marginRight: 4 }}
                                >
                                    Xem
                                </Button>
                                <Button
                                    icon={<EditOutlined />}
                                    size="small"
                                    onClick={() => navigate(`/admin/category/edit/${item._id}`)}
                                    style={{ marginRight: 4 }}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    danger
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Xóa
                                </Button>
                            </Col>
                        </Row>
                    ))
                )}
            </div>
        </div>
    );
}

export default CategoryAdmin;
