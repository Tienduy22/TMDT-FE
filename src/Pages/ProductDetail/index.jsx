import { Col, Row } from "antd";
import { Button } from "antd";
import { Flex } from "antd";
import {
    SafetyOutlined,
    TruckOutlined,
    SolutionOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.scss";
import { useDispatch, useSelector } from "react-redux";
import { addOrder } from "../../Redux/reducers/orderReducer";
import { InputNumber,Rate } from "antd";
import { jwtDecode } from "jwt-decode";
import * as cartService from "@/Services/cartService";
import CommentProduct from "../../Componets/Comment";
import RecommendProducts from "../../Componets/RecommendProducts";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(1);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    let user_id;
    if (user.token) {
        user_id = jwtDecode(user.token).id;
    }

    useEffect(() => {
        fetch(`http://localhost:3000/api/v1/admin/products/detail/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data[0]);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [id]);

    if (!product) {
        return <h1>Loading...</h1>;
    }

    const handleClickCart = () => {
        const orderItem = {
            name: product?.title,
            amount: amount,
            image: product?.thumbnail,
            price: product?.price,
            product_id: product?._id,
        };
        if (!user_id) {
            dispatch(
                addOrder({
                    orderItem,
                })
            );
        } else {
            const addCart = async () => {
                const res = cartService.cartUpdate(user_id, orderItem);
            };
            addCart();
        }
    };

    const onChangeNumber = (value) => {
        setAmount(parseInt(value));
    };


    return (
        <div className="container-productdetail">
            <Row>
                <Col span={2}></Col>
                <Col span={20} className="product-detail">
                    <Row>
                        <Col span={11} className="product-image">
                            <img src={product.thumbnail} alt={product.title} />
                        </Col>
                        <Col span={12} className="product-info">
                            <p className="title">{product.title}</p>
                            <div className="rate">
                                <Rate defaultValue={product.rate_total} />
                            </div>
                            <p className="price">
                                {product.price.toLocaleString()} đ
                            </p>
                            
                            <InputNumber
                                className="amount"
                                min={1}
                                max={10}
                                defaultValue={1}
                                onChange={onChangeNumber}
                            />
                            <Flex wrap gap="small">
                                <Button className="btn-buy">Mua ngay</Button>
                                <Button
                                    className="add-cart"
                                    onClick={handleClickCart}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                            </Flex>

                            <div className="product-service">
                                <Row gutter={[15, 15]}>
                                    <Col span={12}>
                                        <SafetyOutlined
                                            className="service"
                                            style={{ fontSize: 40 }}
                                        />{" "}
                                        <p className="service-text">
                                            Bảo hành 12 tháng tận nơi
                                        </p>
                                    </Col>
                                    <Col span={12}>
                                        <TruckOutlined
                                            className="service"
                                            style={{ fontSize: 40 }}
                                        />{" "}
                                        <p className="service-text">
                                            Free Ship toàn quốc từ 1.000k
                                        </p>
                                    </Col>
                                </Row>
                                <Row gutter={[15, 15]}>
                                    <Col span={12}>
                                        <SolutionOutlined
                                            className="service"
                                            style={{ fontSize: 40 }}
                                        />{" "}
                                        <p className="service-text">
                                            Hoàn trả nếu không hài lòng
                                        </p>
                                    </Col>
                                    <Col span={12}>
                                        <InboxOutlined
                                            className="service"
                                            style={{ fontSize: 40 }}
                                        />{" "}
                                        <p className="service-text">
                                            Kiểm tra trước khi thanh toán
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <CommentProduct id={id} product={product} />
                    </Row>
                    <Row>
                        <RecommendProducts product_id={product._id} />
                    </Row>
                </Col>
                <Col span={2}></Col>
            </Row>
        </div>
    );
}

export default ProductDetail;
