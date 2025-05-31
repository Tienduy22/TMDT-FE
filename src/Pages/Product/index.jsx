import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";
import NavbarComponents from "@/Componets/NavbarComponents";
import CardProduct from "@/Componets/CardProduct";
import * as ProductService from "@/Services/productService";
import "./Product.scss";
import ProductFilter from "@/Componets/ProductFilters/ProductFilter";
import PaginationComponents from "@/Componets/Pagination";

function Product() {
    const [product, setProduct] = useState([]);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await ProductService.productGet(filters.CategoryId);
                setProduct(res.products);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchProduct();
    }, [filters]);

    const handleProductClick = (item) => {
        navigate(`/products/detail/${item._id}`);
    };

    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    const handleChange = (e) => {
        console.log(e);
    };

    return (
        <div className="container-product">
            <Row className="product-list-title">
                <ProductFilter filters={filters} onChange={handleFilterChange} />
            </Row>
            <Row className="product-main">
                <Col xs={24} sm={24} md={5} lg={4} xl={4} className="navbar">
                    <NavbarComponents />
                </Col>
                <Col xs={24} sm={24} md={19} lg={20} xl={20} style={{paddingLeft:30}}>
                    <Row gutter={[90, 90]}>
                        {product.map((item, index) => (
                            <Col
                                xs={24}
                                sm={12}
                                md={8}
                                lg={8}
                                xl={8}
                                key={index}
                                className="product-item"
                                onClick={() => handleProductClick(item)}
                            >
                                <CardProduct
                                    img={item.thumbnail}
                                    title={item.title}
                                    price={item.price}
                                    discount={item.discount}
                                />
                            </Col>
                        ))}
                    </Row>
                    <div className="pagination-container">
                        <PaginationComponents onChange={handleChange} />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Product;
