import { useState, useEffect } from "react";
import { InputNumber, Button, Row, Col, Card, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./Cart.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    increaseAmount,
    decreaseAmount,
    removeOrder,
} from "../../Redux/reducers/orderReducer";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as cartService from "@/Services/cartService";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    let user_id;
    if (user.token) {
        user_id = jwtDecode(user.token).id;
    }
    const reduxOrderItems = useSelector((state) => state.order.orderItems);

    const [order, setOrder] = useState(reduxOrderItems);

    const fetchOrder = async () => {
        if (user_id) {
            const res = await cartService.cartGet(user_id);
            setOrder(res.cart.products);
        } else {
            setOrder(reduxOrderItems);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [user_id, reduxOrderItems]);
    console.log(order);

    const totalPrice = order?.reduce((total, item) => {
        return total + item.price * item.amount;
    }, 0);

    const handleNavigateProduct = () => {
        navigate("/products");
    };

    const handleIncreaseAmount = (id) => {
        dispatch(
            increaseAmount({
                orderItem: {
                    product_id: id,
                },
            })
        );
    };

    const handleDecreaseAmount = (id) => {
        dispatch(
            decreaseAmount({
                orderItem: {
                    product_id: id,
                },
            })
        );
    };

    const deleteProduct = async (user_id, productId) => {
        if (!user_id) {
            dispatch(
                removeOrder({
                    orderItem: {
                        product_id: productId,
                    },
                })
            );
        } else {
            await cartService.cartDelete(user_id, productId);
            fetchOrder();
        }
    };

    const handleDeleteProduct = (id) => {
        deleteProduct(user_id, id);
    };

    const handleNavigateInfoOrder = () => {
        navigate("/info_order");
    };

    return (
        <div className="cart-container">
            <Row gutter={[16, 16]}>
                {/* Cart item */}
                <Col span={16} className="cart-item">
                    <Card hoverable className="product-card">
                        <Row>
                            <Col
                                span={15}
                                className="product-image"
                                style={{ paddingLeft: 40 }}
                            >
                                <h2> Sản phẩm</h2>
                            </Col>
                            <Col span={3} className="product-image">
                                <h2> Giá</h2>
                            </Col>
                            <Col span={3} className="product-image">
                                <h2> Số lượng</h2>
                            </Col>
                            <Col span={3} className="product-image">
                                <h2> Tạm tính</h2>
                            </Col>
                        </Row>
                        {order?.map((item) => {
                            console.log(item);
                            return (
                                <Row align="middle" key={item._id}>
                                    <Col span={1}>
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={
                                                <CloseOutlined
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#4d4c4c",
                                                    }}
                                                />
                                            }
                                            style={{
                                                background: "white",
                                                borderColor: "#c9c3c3",
                                            }}
                                            onClick={() =>
                                                handleDeleteProduct(
                                                    item.product_id
                                                )
                                            }
                                        ></Button>
                                    </Col>
                                    <Col span={4} className="product-image">
                                        <img
                                            src={item.image} // Replace with your image
                                            alt="Product"
                                            className="img-product"
                                        />
                                    </Col>
                                    <Col span={10} className="product-details">
                                        <h3 className="product-title">
                                            {item.name}
                                        </h3>
                                    </Col>
                                    <Col span={3} className="product-price">
                                        {item.price.toLocaleString()}đ
                                    </Col>
                                    <Col span={3} className="text-right">
                                        {/* <InputNumber
                                            min={1}
                                            max={10}
                                            step={1}
                                            value={item.amount}
                                            onChange={(value) => {
                                                setAmount(value)
                                                handleChangeAmount(
                                                    item.product
                                                );
                                            }}
                                        /> */}
                                        <div class="amount">
                                            <button
                                                class="decrease-amount"
                                                onClick={() => {
                                                    handleDecreaseAmount(
                                                        item.product
                                                    );
                                                }}
                                            >
                                                -
                                            </button>
                                            <input
                                                class="amount-input"
                                                value={item.amount}
                                                min="1"
                                            />
                                            <button
                                                class="increase-amount"
                                                onClick={() => {
                                                    handleIncreaseAmount(
                                                        item.product
                                                    );
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </Col>
                                    <Col span={3} className="text-right">
                                        {(
                                            item.price * item.amount
                                        ).toLocaleString()}
                                        đ
                                    </Col>
                                </Row>
                            );
                        })}
                    </Card>
                </Col>

                {/* Cart details */}
                <Col span={8} className="cart-summary">
                    <Card title="Tổng Cộng Giỏ Hàng" className="summary-card">
                        <Row className="cart-summary-item">
                            <Col span={12}>
                                <strong>Tổng:</strong>
                            </Col>
                            <Col span={12} className="text-right">
                                {totalPrice.toLocaleString()} VNĐ
                            </Col>
                        </Row>
                        <Input
                            className="discount-input"
                            size="large"
                            placeholder="Nhập mã giảm giá"
                            addonAfter={<Button type="link">Áp dụng</Button>}
                        />
                        <Button
                            block
                            type="primary"
                            className="checkout-button"
                            onClick={handleNavigateInfoOrder}
                        >
                            TIẾN HÀNH THANH TOÁN
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Button
                type="link"
                className="continue-shopping-button"
                onClick={handleNavigateProduct}
            >
                ← Tiếp tục xem sản phẩm
            </Button>
        </div>
    );
};

export default Cart;
