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
import * as cartService from "../../Services/cartService";
import {
    decreaseAmountCart,
    increaseAmountCart,
    removeCartItem,
} from "../../Redux/reducers/cartUserReducer";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    let user_id;
    if (user.token) {
        user_id = jwtDecode(user.token).id;
    }

    const [order, setOrder] = useState([]);

    const reduxCartItems = useSelector((state) => state.cartUser.cartItems);
    const reduxOrderItems = useSelector((state) => state.order.orderItems);

    useEffect(() => {
        if (user_id) {
            setOrder(reduxCartItems);
        } else {
            setOrder(reduxOrderItems);
        }
    }, [user_id, reduxCartItems, reduxOrderItems]);

    const totalPrice = order?.reduce((total, item) => {
        return total + item.price * item.amount;
    }, 0);

    const handleNavigateProduct = () => {
        navigate("/products");
    };

    const handleIncreaseAmount = async (id) => {
        if (!user_id) {
            dispatch(
                increaseAmount({
                    orderItem: {
                        product_id: id,
                    },
                })
            );
        } else {
            await cartService.cartUpdateQuantity(user_id,"increase",id)
            dispatch(
                increaseAmountCart({
                    cartItem: {
                        product_id: id,
                    },
                })
            );
        }
    };

    const handleDecreaseAmount = async (id) => {
        if (!user_id) {
            dispatch(
                decreaseAmount({
                    orderItem: {
                        product_id: id,
                    },
                })
            );
        } else {
            await cartService.cartUpdateQuantity(user_id,"decrease",id)
            dispatch(
                decreaseAmountCart({
                    cartItem: {
                        product_id: id,
                    },
                })
            );
        }
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
            dispatch(
                removeCartItem({
                    cartItem: {
                        product_id: productId,
                    },
                })
            );
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
                <Col span={16} className="cart__main">
                    <Card hoverable className="cart__main-card">
                        <Row>
                            <Col
                                span={12}
                                className="cart__main-header cart__main-header--product"
                            >
                                <p>Sản phẩm</p>
                            </Col>
                            <Col
                                span={4}
                                className="cart__main-header cart__main-header--price"
                            >
                                <p>Giá</p>
                            </Col>
                            <Col
                                span={4}
                                className="cart__main-header cart__main-header--amount"
                            >
                                <p>Số lượng</p>
                            </Col>
                            <Col
                                span={4}
                                className="cart__main-header cart__main-header--total"
                            >
                                <p>Tạm tính</p>
                            </Col>
                        </Row>
                        {order && order.length > 0 ? (
                            order.map((item) => (
                                <Row align="middle" key={item._id}>
                                    <Col span={1} className="cart__main-action">
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
                                        />
                                    </Col>
                                    <Col span={4} className="cart__main-image">
                                        <img
                                            src={item.image}
                                            alt="Product"
                                            className="cart__main-img"
                                        />
                                    </Col>
                                    <Col
                                        span={7}
                                        className="cart__main-details"
                                    >
                                        <p className="cart__main-title">
                                            {item.name}
                                        </p>
                                    </Col>
                                    <Col span={4} className="cart__main-price">
                                        {item.price.toLocaleString()}đ
                                    </Col>
                                    <Col span={4} className="cart__main-amount">
                                        <div className="cart__main-amount-group">
                                            <button
                                                className="cart__main-amount-btn"
                                                onClick={() =>
                                                    handleDecreaseAmount(
                                                        item.product_id
                                                    )
                                                }
                                            >
                                                -
                                            </button>
                                            <input
                                                className="cart__main-amount-input"
                                                value={item.amount}
                                                min="1"
                                                readOnly
                                            />
                                            <button
                                                className="cart__main-amount-btn"
                                                onClick={() =>
                                                    handleIncreaseAmount(
                                                        item.product_id
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </Col>
                                    <Col span={4} className="cart__main-total">
                                        {(
                                            item.price * item.amount
                                        ).toLocaleString()}
                                        đ
                                    </Col>
                                </Row>
                            ))
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "20px 0",
                                }}
                                className="no-product"
                            >
                                <img src="/online-shopping.png" />
                                <p>Chưa có sản phẩm nào</p>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col span={8} className="cart-summary">
                    <Card title="Tổng Cộng Giỏ Hàng" className="summary-card">
                        <Row className="ship-price">
                            <Col span={12}>
                                <strong className="text">
                                    Chi phí vận chuyển:
                                </strong>
                            </Col>
                            <Col span={12} className="text-right">
                                35.000 VNĐ
                            </Col>
                        </Row>
                        <Row className="cart-summary-item">
                            <Col span={12}>
                                <strong className="text">Tổng:</strong>
                            </Col>
                            <Col span={12} className="text-right">
                                {(totalPrice + 35000).toLocaleString()} VNĐ
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
