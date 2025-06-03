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
        setFilters((...preFilters) => ({
            ...preFilters,
            ...newFilters,
        }));
    };

    const handleChange = (e) => {
        console.log(e);
    };

    return (
        <div className="container-product">
            <Row className="product-page-layout" gutter={24}>
                <Col span={4} className="nav-col">
                    <NavbarComponents />
                </Col>

                <Col span={18}>
                    <Row className="filter-row">
                        <ProductFilter
                            filters={filters}
                            onChange={handleFilterChange}
                        />
                    </Row>
                    <Row gutter={[16, 16]} className="product-list-item">
                        {product.map((item, index) => (
                            <Col span={8} key={index} className="product-item" onClick={() => handleProductClick(item)}>
                                <CardProduct
                                    img={item.thumbnail}
                                    title={item.title}
                                    price={item.price}
                                    rate={item.rate_total}
                                />
                            </Col>
                        ))}
                    </Row>
                    <PaginationComponents onChange={handleChange} />
                </Col>
            </Row>
        </div>
    );
}

export default Product;
