import { useState, useEffect } from "react";
import { InputNumber, Button, Row, Col, Card, Input } from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
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
import { message } from "antd";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    let user_id;
    if (user.token) {
        user_id = jwtDecode(user.token).id;
    }
    const reduxOrderItems = useSelector((state) => state.order.orderItems);

    const [order, setOrder] = useState([]);

    const fetchOrder = async () => {
        try {
            if (user_id) {
                const res = await cartService.cartGet(user_id);
                if (res.cart && Array.isArray(res.cart.products)) {
                    const processedProducts = res.cart.products
                        .filter(product => product && typeof product === 'object')
                        .map(product => ({
                            ...product,
                            price: parseFloat(product.price) || 0,
                            amount: parseInt(product.amount) || 1,
                            product_id: product.product_id || product.id,
                            id: product.product_id || product.id
                        }));
                    setOrder(processedProducts);
                } else {
                    setOrder([]);
                }
            } else {
                const localItems = Array.isArray(reduxOrderItems) 
                    ? reduxOrderItems
                        .filter(item => item && typeof item === 'object')
                        .map(item => ({
                            ...item,
                            price: parseFloat(item.price) || 0,
                            amount: parseInt(item.amount) || 1,
                            product_id: item.product_id || item.id,
                            id: item.product_id || item.id
                        }))
                    : [];
                setOrder(localItems);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setOrder([]);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [user_id, reduxOrderItems]);

    const totalPrice = order.reduce((total, item) => {
        if (!item || typeof item !== 'object') return total;
        const price = parseFloat(item.price) || 0;
        const amount = parseInt(item.amount) || 0;
        return total + (price * amount);
    }, 0);

    const handleNavigateProduct = () => {
        navigate("/products");
    };

    const handleQuantityChange = async (value, item) => {
        if (!value || value < 1 || !item) {
            message.error('Số lượng phải lớn hơn 0');
            return;
        }

        try {
            const productId = item.product_id || item.id;
            if (!productId) {
                message.error('Không tìm thấy thông tin sản phẩm');
                return;
            }

            if (user_id) {
                await cartService.cartUpdate(user_id, productId, parseInt(value));
                fetchOrder();
            } else {
                const updatedItems = order.map(orderItem => {
                    const itemId = orderItem.product_id || orderItem.id;
                    if (itemId === productId) {
                        return { ...orderItem, amount: parseInt(value) };
                    }
                    return orderItem;
                });
                setOrder(updatedItems);
                dispatch({
                    type: 'UPDATE_ORDER_ITEMS',
                    payload: updatedItems
                });
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            message.error('Có lỗi xảy ra khi cập nhật số lượng');
        }
    };

    const handleIncreaseAmount = (id) => {
        if (!id) return;
        const item = order.find(item => {
            const itemId = item.product_id || item.id;
            return itemId === id;
        });
        if (item) {
            handleQuantityChange(item.amount + 1, item);
        }
    };

    const handleDecreaseAmount = (id) => {
        if (!id) return;
        const item = order.find(item => {
            const itemId = item.product_id || item.id;
            return itemId === id;
        });
        if (item && item.amount > 1) {
            handleQuantityChange(item.amount - 1, item);
        }
    };

    const deleteProduct = async (user_id, productId) => {
        if (!productId) {
            message.error('Không tìm thấy thông tin sản phẩm');
            return;
        }

        try {
            if (!user_id) {
                const updatedItems = order.filter(item => {
                    const itemId = item.product_id || item.id;
                    return itemId !== productId;
                });
                setOrder(updatedItems);
                dispatch({
                    type: 'UPDATE_ORDER_ITEMS',
                    payload: updatedItems
                });
            } else {
                await cartService.cartDelete(user_id, productId);
                fetchOrder();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            message.error('Có lỗi xảy ra khi xóa sản phẩm');
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
            <Row gutter={[24, 24]}>
                <Col span={16} className="cart-item">
                    <Card hoverable className="product-card">
                        <Row>
                            <Col span={14} className="product-image" style={{ paddingLeft: 60 }}>
                                <h2>Sản phẩm</h2>
                            </Col>
                            <Col span={3} className="product-image">
                                <h2>Giá</h2>
                            </Col>
                            <Col span={4} className="product-image">
                                <h2>Số lượng</h2>
                            </Col>
                            <Col span={3} className="product-image">
                                <h2>Tạm tính</h2>
                            </Col>
                        </Row>
                        {order.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" 
                                    alt="Empty Cart" 
                                    style={{ width: '120px', marginBottom: '20px' }}
                                />
                                <h3 style={{ color: '#666', marginBottom: '16px' }}>Giỏ hàng của bạn đang trống</h3>
                                <Button 
                                    type="primary" 
                                    size="large"
                                    onClick={handleNavigateProduct}
                                    style={{ 
                                        background: 'linear-gradient(45deg, #1890ff, #096dd9)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0 24px'
                                    }}
                                >
                                    Tiếp tục mua sắm
                                </Button>
                            </div>
                        ) : (
                            order.map((item) => (
                                <Row align="middle" key={item._id || item.id} style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', backgroundColor: '#fafafa' }}>
                                    <Col span={14}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <Button 
                                                type="text" 
                                                icon={<CloseOutlined style={{ color: '#999' }} />}
                                                onClick={() => handleDeleteProduct(item.product_id || item.id)}
                                                style={{
                                                    padding: 0,
                                                    height: 'auto',
                                                    marginLeft: '-10px',
                                                    marginRight: '10px',
                                                    color: '#999'
                                                }}
                                            />
                                            <img
                                                src={item.image || ''}
                                                alt={item.name || 'Product'}
                                                className="img-product"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <h3 className="product-title" style={{ marginRight: 10 }}>{item.name || 'Sản phẩm không xác định'}</h3>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={3}>
                                        <div style={{ fontSize: '16px', color: '#666', fontWeight: '500' }}>
                                            {(item.price || 0).toLocaleString()}đ
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '12px'
                                        }}>
                                            <div className="quantity-control-group" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                backgroundColor: '#fff'
                                            }}>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    onClick={() => handleDecreaseAmount(item.product_id || item.id)}
                                                    disabled={item.amount <= 1}
                                                    className="decrease-btn"
                                                    style={{
                                                        width: '20px',
                                                        height: '32px',
                                                        padding: 0,
                                                        border: 'none',
                                                        borderRight: '1px solid #d9d9d9',
                                                        borderRadius: 0,
                                                        backgroundColor: '#fafafa',
                                                        color: item.amount <= 1 ? '#d9d9d9' : '#666'
                                                    }}
                                                >
                                                    -
                                                </Button>
                                                <InputNumber
                                                    min={1}
                                                    value={item.amount}
                                                    onChange={(value) => handleQuantityChange(value, item)}
                                                    style={{ 
                                                        width: '40px',
                                                        textAlign: "center",
                                                        border: 'none',
                                                        borderRadius: 0
                                                    }}
                                                    controls={false}
                                                    onBlur={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        if (!value || value < 1) {
                                                            handleQuantityChange(1, item);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    onClick={() => handleIncreaseAmount(item.product_id || item.id)}
                                                    className="increase-btn"
                                                    style={{
                                                        width: '20px',
                                                        height: '32px',
                                                        padding: 0,
                                                        border: 'none',
                                                        borderLeft: '1px solid #d9d9d9',
                                                        borderRadius: 0,
                                                        backgroundColor: '#fafafa',
                                                        color: '#666'
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={3}>
                                        <div style={{ fontSize: '18px', color: '#ff4d4f', fontWeight: '600' }}>
                                            {((item.price || 0) * (item.amount || 1)).toLocaleString()}đ
                                        </div>
                                    </Col>
                                </Row>
                            ))
                        )}
                    </Card>
                </Col>

                <Col span={8} className="cart-summary">
                    <Card title="Tổng Cộng Giỏ Hàng" className="summary-card">
                        <Row className="cart-summary-item">
                            <Col span={12}>
                                <strong>Tổng tiền hàng:</strong>
                            </Col>
                            <Col span={12} className="text-right">
                                {totalPrice.toLocaleString()} VNĐ
                            </Col>
                        </Row>
                        <Row className="cart-summary-item">
                            <Col span={12}>
                                <strong>Phí vận chuyển:</strong>
                            </Col>
                            <Col span={12} className="text-right">
                                Miễn phí
                            </Col>
                        </Row>
                        <Row className="cart-summary-item" style={{ borderTop: '2px solid #f0f0f0', marginTop: '16px', paddingTop: '16px' }}>
                            <Col span={12}>
                                <strong style={{ fontSize: '18px' }}>Tổng thanh toán:</strong>
                            </Col>
                            <Col span={12} className="text-right">
                                <span style={{ fontSize: '20px', color: '#ff4d4f' }}>{totalPrice.toLocaleString()} VNĐ</span>
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
                            disabled={order.length === 0}
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