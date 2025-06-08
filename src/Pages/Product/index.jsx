import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";
import * as ActionUserService from "../../Services/actionUserService"
import CardProduct from "@/Componets/CardProduct";
import * as ProductService from "@/Services/productService";
import "./Product.scss";
import ProductFilter from "@/Componets/ProductFilters/ProductFilter";
import PaginationComponents from "@/Componets/Pagination";
import NavbarComponents from "../../Componets/NavbarComponents";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

function Product() {
    const [product, setProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    let user_id;
    if (user.token) {
        user_id = jwtDecode(user.token).id;
    }

    const fetchProduct = async () => {
        try {
            const res = await ProductService.productGet(
                filters.CategoryId,
                filters.material,
                filters.priceRange,
                filters.sort,
                currentPage
            );
            setProduct(res.products);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [filters, currentPage]);

    const handleChangePagination = (e) => {
        setCurrentPage(e);
    };

    const handleProductClick = async (item) => {
        const data = {
            user_id: user_id,
            product_id: [item._id],
            action_type: "view",
        };
        await ActionUserService.UserAction(data)

        navigate(`/products/detail/${item._id}`);
    };

    const handleFilterChange = (newFilters) => {
        setFilters((...preFilters) => ({
            ...preFilters,
            ...newFilters,
        }));
        setCurrentPage(1);
    };

    console.log(filters);

    return (
        <div className="container-product">
            <Row className="product-page-layout" gutter={24}>
                <Col span={4} className="nav-col">
                    <NavbarComponents
                        filters={filters}
                        onChange={handleFilterChange}
                    />
                </Col>

                <Col span={18}>
                    <Row className="filter-row">
                        <ProductFilter
                            filters={filters}
                            onChange={handleFilterChange}
                        />
                    </Row>
                    <Row gutter={[16, 16]} className="product-list-item">
                        {product?.map((item, index) => (
                            <Col
                                span={8}
                                key={index}
                                className="product-item"
                                onClick={() => handleProductClick(item)}
                            >
                                <CardProduct
                                    img={item.thumbnail}
                                    title={item.title}
                                    price={item.price}
                                    rate={item.rate_total}
                                />
                            </Col>
                        ))}
                    </Row>
                    <div className="pagination">
                        <PaginationComponents
                            onChange={handleChangePagination}
                            category_id={filters.CategoryId}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Product;
