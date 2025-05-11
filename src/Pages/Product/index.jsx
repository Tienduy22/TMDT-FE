import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";
import NavbarComponents from "../../Componets/NavbarComponents";
import CardProduct from "../../Componets/CardProduct";
import * as ProductService from "../../Services/productService";
import "./Product.scss";
import { useMutationHook } from "../../Hooks/useMutationHook";

function Product() {
    const productListTitle = ["Khuyên tai", "Vòng cổ", "Vòng tay", "Nhẫn"];

    const [product, setProduct] = useState([]);
    const navigate = useNavigate();

    const mutation = useMutationHook((data) => ProductService.productGet(data));

    const { data } = mutation;

    console.log(mutation)
    

    // useEffect(() => {
    //     fetch("http://localhost:3000/api/v1/admin/products")
    //         .then((response) => response.json())
    //         .then((data) => {
    //             setProduct(data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching data:", error);
    //         });
    // }, []);

    useEffect(() => {
        mutation.mutate();
        setProduct(data)
    },[data])

    const handleProductClick = (item) => {
        navigate(`/products/detail/${item._id}`);
    };
    return (
        <div className="container-product">
            <Row className="product-list-title">
                {productListTitle.map((title, index) => (
                    <Col span={24 / productListTitle.length} key={index}>
                        <div className="product-title">{title}</div>
                    </Col>
                ))}
            </Row>
            <Row className="product-main">
                <Col span={4} className="navbar">
                    <NavbarComponents />
                </Col>
                <Col span={20}>
                    <Row gutter={[16, 16]}>
                        {product.map((item, index) => (
                            <Col
                                span={7}
                                key={index}
                                className="product-item"
                                style={{ marginLeft: "50px" }}
                                onClick={() => handleProductClick(item)}
                            >
                                <CardProduct
                                    img={item.thumbnail}
                                    title={item.title}
                                    price={item.price}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default Product;
