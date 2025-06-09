import { useEffect, useState } from "react";
import { Button, Input, Row, Col, message } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./ProductAdmin.scss";
import PaginationComponents from "../../../../Componets/Pagination";
import * as ProductService from "../../../../Services/productService";
import { useNavigate } from "react-router-dom";
import { TakePermissions } from "../../../../Componets/TakePermissions";

function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const permissions = TakePermissions();


    useEffect(() => {
        const productGet = async () => {
            const res = await ProductService.productGet(currentPage);
            setProducts(res.products);
        };
        productGet();
    }, [currentPage]);

    const handleChangePagination = (e) => {
        console.log(e)
        setCurrentPage(e);
    };

    const handleDelete = async (id) => {
        const res = await ProductService.productDelete(id);
        if (res.code === 200) {
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product._id !== id)
            );
            message.success("Xóa sản phẩm thành công!");
        } else {
            message.error("Xóa sản phẩm thất bại!");
        }
    };

    return (
        <div className="product-admin">
            {permissions.includes("product_view") ? (
                <>
                    <div className="product-admin__header">
                        <h2>Quản lý sản phẩm</h2>
                        {permissions.includes("product_create") ? (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() =>
                                    navigate("/admin/product/create")
                                }
                            >
                                Thêm sản phẩm
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="product-admin__search">
                        <Input
                            placeholder="Tìm kiếm sản phẩm..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </div>
                    <div className="product-grid">
                        {/* Header */}
                        <Row className="product-grid-header" gutter={0}>
                            <Col span={1}>
                                <b>STT</b>
                            </Col>
                            <Col span={3}>
                                <b>Ảnh</b>
                            </Col>
                            <Col span={6}>
                                <b>Tên sản phẩm</b>
                            </Col>
                            <Col span={3}>
                                <b>Giá</b>
                            </Col>
                            <Col span={2}>
                                <b>Tồn kho</b>
                            </Col>
                            <Col span={4}>
                                <b>Người tạo</b>
                            </Col>
                            <Col span={4}>
                                <b>Hành động</b>
                            </Col>
                        </Row>

                        {products.length === 0 ? (
                            <Row
                                className="product-grid-row"
                                style={{ textAlign: "center" }}
                            >
                                <Col span={24}>Không có sản phẩm nào.</Col>
                            </Row>
                        ) : (
                            products.map((item, index) => (
                                <Row
                                    className="product-grid-row"
                                    key={item.key}
                                    gutter={0}
                                    align="middle"
                                >
                                    <Col span={1}>{(index += 1)}</Col>
                                    <Col span={3}>
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt="product"
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
                                    <Col span={3}>
                                        {item.price?.toLocaleString()} đ
                                    </Col>
                                    <Col span={2}>{item.stock}</Col>
                                    <Col span={4}>{item.create}</Col>
                                    <Col span={4}>
                                        <Button
                                            icon={<EyeOutlined />}
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/product/detail/${item._id}`
                                                )
                                            }
                                            style={{ marginRight: 4 }}
                                        >
                                            Xem
                                        </Button>
                                        {permissions.includes(
                                            "product_edit"
                                        ) ? (
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/product/edit/${item._id}`
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
                                            "product_deleted"
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
                    <div className="pagination" style={{marginTop:20}}>
                        <PaginationComponents
                            onChange={handleChangePagination}
                        />
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

export default ProductAdmin;
