import "./InfoOrder.scss";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Button, Input, Radio, message, InputNumber, Divider } from "antd";
import { useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import * as cartService from "@/Services/cartService";
const { TextArea } = Input;

const InfoOrder = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        note: '',
        payment: ''
    });
    const [orderItems, setOrderItems] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Safely decode token
        try {
            if (user.token) {
                const decoded = jwtDecode(user.token);
                setUserId(decoded.id);
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            setUserId(null);
        }
    }, [user.token]);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                if (user.token && userId) {
                    const res = await cartService.cartGet(userId);
                    if (res.cart && Array.isArray(res.cart.products)) {
                        const processedProducts = res.cart.products
                            .filter(product => product && typeof product === 'object')
                            .map(product => ({
                                id: product.id || product.product_id,
                                product_id: product.product_id || product.id,
                                name: product.name || product.title || 'Sản phẩm không xác định',
                                price: parseFloat(product.price) || 0,
                                amount: parseInt(product.amount) || 1,
                                image: product.image || product.thumbnail || ''
                            }));
                        setOrderItems(processedProducts);
                        dispatch({
                            type: 'UPDATE_ORDER_ITEMS',
                            payload: processedProducts
                        });
                    } else {
                        setOrderItems([]);
                        dispatch({
                            type: 'UPDATE_ORDER_ITEMS',
                            payload: []
                        });
                    }
                } else {
                    const localItems = Array.isArray(order.orderItems) 
                        ? order.orderItems
                            .filter(item => item && typeof item === 'object')
                            .map(item => ({
                                id: item.id || item.product_id,
                                product_id: item.product_id || item.id,
                                name: item.name || item.title || 'Sản phẩm không xác định',
                                price: parseFloat(item.price) || 0,
                                amount: parseInt(item.amount) || 1,
                                image: item.image || item.thumbnail || ''
                            }))
                        : [];
                    setOrderItems(localItems);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                message.error('Có lỗi xảy ra khi tải giỏ hàng');
                setOrderItems([]);
                dispatch({
                    type: 'UPDATE_ORDER_ITEMS',
                    payload: []
                });
            }
        };

        fetchCartData();
    }, [user.token, userId, dispatch]);

    const totalPrice = orderItems.reduce((total, item) => {
        if (!item || typeof item !== 'object') return total;
        const price = parseFloat(item.price) || 0;
        const amount = parseInt(item.amount) || 0;
        return total + (price * amount);
    }, 0);

    const style = {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleQuantityChange = async (value, item) => {
        if (!value || value < 1 || !item || typeof item !== 'object') {
            message.error('Số lượng không hợp lệ');
            return;
        }

        try {
            const productId = item.product_id || item.id;
            if (!productId) {
                message.error('Không tìm thấy thông tin sản phẩm');
                return;
            }

            const newAmount = parseInt(value) || 1;
            if (newAmount > 10) {
                message.error('Số lượng tối đa là 10');
                return;
            }

            const updatedItems = orderItems.map(orderItem => {
                const itemId = orderItem.product_id || orderItem.id;
                if (itemId === productId) {
                    return { ...orderItem, amount: newAmount };
                }
                return orderItem;
            });
            
            setOrderItems(updatedItems);
            dispatch({
                type: 'UPDATE_ORDER_ITEMS',
                payload: updatedItems
            });

            if (user.token && userId) {
                await cartService.cartUpdate(userId, productId, newAmount);
                // Fetch lại dữ liệu giỏ hàng sau khi cập nhật
                const res = await cartService.cartGet(userId);
                if (res.cart && Array.isArray(res.cart.products)) {
                    const processedProducts = res.cart.products
                        .filter(product => product && typeof product === 'object')
                        .map(product => ({
                            id: product.id || product.product_id,
                            product_id: product.product_id || product.id,
                            name: product.name || product.title || 'Sản phẩm không xác định',
                            price: parseFloat(product.price) || 0,
                            amount: parseInt(product.amount) || 1,
                            image: product.image || product.thumbnail || ''
                        }));
                    setOrderItems(processedProducts);
                    dispatch({
                        type: 'UPDATE_ORDER_ITEMS',
                        payload: processedProducts
                    });
                }
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            message.error('Có lỗi xảy ra khi cập nhật số lượng');
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!itemId) {
            message.error('Không tìm thấy sản phẩm');
            return;
        }

        try {
            // Cập nhật local state trước
            const updatedItems = orderItems.filter(item => {
                const currentItemId = item.product_id || item.id;
                return currentItemId !== itemId;
            });
            
            setOrderItems(updatedItems);
            dispatch({
                type: 'UPDATE_ORDER_ITEMS',
                payload: updatedItems
            });

            // Nếu user đã đăng nhập, cập nhật trên server
            if (user.token && userId) {
                const response = await cartService.cartDelete(userId, itemId);
                if (response.code === 200) {
                    // Fetch lại dữ liệu giỏ hàng sau khi xóa
                    const res = await cartService.cartGet(userId);
                    if (res.cart && Array.isArray(res.cart.products)) {
                        const processedProducts = res.cart.products
                            .filter(product => product && typeof product === 'object')
                            .map(product => ({
                                id: product.id || product.product_id,
                                product_id: product.product_id || product.id,
                                name: product.name || product.title || 'Sản phẩm không xác định',
                                price: parseFloat(product.price) || 0,
                                amount: parseInt(product.amount) || 1,
                                image: product.image || product.thumbnail || ''
                            }));
                        setOrderItems(processedProducts);
                        dispatch({
                            type: 'UPDATE_ORDER_ITEMS',
                            payload: processedProducts
                        });
                    } else {
                        // Nếu không có sản phẩm nào, set empty array
                        setOrderItems([]);
                        dispatch({
                            type: 'UPDATE_ORDER_ITEMS',
                            payload: []
                        });
                    }
                    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
                } else {
                    message.error('Có lỗi xảy ra khi xóa sản phẩm');
                    // Rollback local state nếu server update thất bại
                    setOrderItems(orderItems);
                    dispatch({
                        type: 'UPDATE_ORDER_ITEMS',
                        payload: orderItems
                    });
                }
            } else {
                // Nếu user chưa đăng nhập, chỉ cập nhật local state
                message.success('Đã xóa sản phẩm khỏi giỏ hàng');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            message.error('Có lỗi xảy ra khi xóa sản phẩm');
            // Rollback local state nếu có lỗi
            setOrderItems(orderItems);
            dispatch({
                type: 'UPDATE_ORDER_ITEMS',
                payload: orderItems
            });
        }
    };

    const validateForm = () => {
        if (!formData.name || !formData.address || !formData.phone || !formData.email) {
            message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return false;
        }
        if (!formData.payment) {
            message.error('Vui lòng chọn phương thức thanh toán');
            return false;
        }
        return true;
    }

    const handleSubmitOrder = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch("http://localhost:3000/api/v1/client/order/create", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    infoUser: {
                        name: formData.name,
                        address: formData.address,
                        phone: formData.phone,
                        email: formData.email,
                        note: formData.note
                    },
                    product: orderItems,
                    totalPrice: totalPrice,
                    payment: formData.payment
                })
            });

            const data = await response.json();
            if (data.code === 200) {
                message.success('Đặt hàng thành công!');
                handleNavigateSuccessOrder();
            } else {
                message.error('Đặt hàng thất bại: ' + data.message);
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi đặt hàng');
            console.error("Error creating order:", error);
        }
    }

    const handleNavigateSuccessOrder = () => {
        navigate('/success-order')
    }

    return (
        <div style={{ 
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
            padding: '40px 0'
        }}>
            <Row
                gutter={[24, 24]}
                className="container"
                style={{ 
                    fontFamily: "Roboto",
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px'
                }}
            >
                <Col
                    span={14}
                    className="info"
                    style={{ 
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <h2 style={{ 
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '24px',
                        color: '#333'
                    }}>Thông tin thanh toán</h2>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ 
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: '#333'
                        }}>Họ và Tên</p>
                        <Input 
                            name="name"
                            placeholder="Họ và tên ..." 
                            value={formData.name}
                            onChange={handleInputChange}
                            style={{ height: '40px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ 
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: '#333'
                        }}>Địa chỉ</p>
                        <Input 
                            name="address"
                            placeholder="Địa chỉ ..." 
                            value={formData.address}
                            onChange={handleInputChange}
                            style={{ height: '40px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ 
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: '#333'
                        }}>Số điện thoại</p>
                        <Input 
                            name="phone"
                            placeholder="Số điện thoại ..." 
                            value={formData.phone}
                            onChange={handleInputChange}
                            style={{ height: '40px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ 
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: '#333'
                        }}>Email</p>
                        <Input 
                            name="email"
                            placeholder="Email ..." 
                            value={formData.email}
                            onChange={handleInputChange}
                            style={{ height: '40px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ 
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: '#333'
                        }}>Thông tin bổ sung</p>
                        <TextArea
                            name="note"
                            placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn..."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            value={formData.note}
                            onChange={handleInputChange}
                            style={{ 
                                resize: 'none',
                                padding: '12px'
                            }}
                        />
                    </div>
                </Col>

                <Col span={10} className="order" style={{ 
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    padding: '30px'
                }}>
                    <div style={{ 
                        padding: '0 0 20px 0',
                        borderBottom: '1px solid #f0f0f0',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <p style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#333' }}>Đơn hàng của bạn</p>
                        </div>
                    </div>

                    {orderItems && orderItems.length > 0 ? (
                        <>
                            <div style={{ 
                                backgroundColor: '#fafafa',
                                padding: '15px',
                                borderRadius: '4px',
                                marginBottom: '20px'
                            }}>
                                <Row gutter={[10,10]} className="order1">
                                    <Col span={18}><p style={{ margin: 0, color: '#666', fontWeight: '500' }}>SẢN PHẨM</p></Col>
                                    <Col span={6} style={{textAlign:"right"}}><p style={{ margin: 0, color: '#666', fontWeight: '500' }}>TẠM TÍNH</p></Col>
                                </Row>
                            </div>

                            {orderItems.map((item, index) => (
                                <div key={index} style={{
                                    padding: '15px 0',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <Row gutter={[10,10]}>
                                        <Col span={18}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <img
                                                    src={item.image || ''}
                                                    alt={item.name || 'Product'}
                                                    style={{ 
                                                        width: '80px', 
                                                        height: '80px', 
                                                        objectFit: 'cover',
                                                        borderRadius: '4px',
                                                        border: '1px solid #f0f0f0'
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ 
                                                        fontSize: '16px', 
                                                        fontWeight: '500',
                                                        marginBottom: '5px',
                                                        color: '#333'
                                                    }}>
                                                        {item.name}
                                                    </div>
                                                    <div style={{ 
                                                        fontSize: '14px', 
                                                        color: '#666',
                                                        marginBottom: '10px'
                                                    }}>
                                                        Đơn giá: {(item.price || 0).toLocaleString()}đ
                                                    </div>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '10px'
                                                    }}>
                                                        <span style={{ fontSize: '14px', color: '#666' }}>Số lượng:</span>
                                                        <InputNumber
                                                            min={1}
                                                            max={10}
                                                            value={item.amount || 1}
                                                            onChange={(value) => handleQuantityChange(value, item)}
                                                            style={{ width: '80px' }}
                                                            controls={true}
                                                            onBlur={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                if (!value || value < 1) {
                                                                    handleQuantityChange(1, item);
                                                                }
                                                            }}
                                                        />
                                                        <Button 
                                                            type="text" 
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleRemoveItem(item.product_id || item.id)}
                                                            style={{ 
                                                                marginLeft: '10px',
                                                                padding: '4px 8px',
                                                                height: 'auto'
                                                            }}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={6} style={{textAlign:"right"}}>
                                            <div style={{ 
                                                fontSize: '16px', 
                                                fontWeight: '500',
                                                color: '#1890ff'
                                            }}>
                                                {((item.price || 0) * (item.amount || 1)).toLocaleString()}đ
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            ))}

                            <Divider style={{ margin: '20px 0' }} />

                            <div style={{ 
                                backgroundColor: '#fafafa',
                                padding: '15px',
                                borderRadius: '4px',
                                marginBottom: '20px'
                            }}>
                                <Row gutter={[10,10]} className="order2">
                                    <Col span={18}>
                                        <span style={{ fontSize: '18px', fontWeight: '500' }}>Tổng cộng</span>
                                    </Col>
                                    <Col span={6} style={{textAlign:"right"}}>
                                        <span style={{ 
                                            fontSize: '20px', 
                                            fontWeight: '600',
                                            color: '#1890ff'
                                        }}>
                                            {(totalPrice).toLocaleString()}đ
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </>
                    ) : (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '40px 20px',
                            backgroundColor: '#fafafa',
                            borderRadius: '4px'
                        }}>
                            <ShoppingCartOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '20px' }} />
                            <p style={{ margin: 0, color: '#666' }}>Không có sản phẩm trong giỏ hàng</p>
                        </div>
                    )}

                    <div className="payment" style={{ marginTop: '20px' }}>
                        <p style={{ 
                            fontSize: '18px', 
                            fontWeight: '500', 
                            marginBottom: '15px',
                            color: '#333'
                        }}>Phương thức thanh toán</p>
                        <div className="payment-option">
                            <Radio.Group
                                style={style}
                                onChange={(e) => handleInputChange({ target: { name: 'payment', value: e.target.value }})}
                                value={formData.payment}
                                options={[
                                    { value: "cod", label: 'Thanh toán khi nhận hàng' },
                                    { value: "paypal", label: 'Thanh toán PAYPAL' },
                                    { value: "vnpay", label: 'Thanh toán VNPAY' },
                                ]}
                            />  
                        </div>
                    </div>

                    {formData.payment === "paypal" ? (
                        <PayPalButton
                            amount={(totalPrice/25000).toFixed(2)}
                            shippingPreference="NO_SHIPPING"
                            onSuccess={(details, data) => {
                                return fetch("http://localhost:3000/api/v1/client/order/paypal-transaction-complete", {
                                    method: "post",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        orderID: data.orderID,
                                        userId: userId,
                                        infoUser: {
                                            name: formData.name,
                                            address: formData.address,
                                            phone: formData.phone,
                                            email: formData.email,
                                            note: formData.note
                                        },
                                        product: orderItems,
                                        totalPrice: totalPrice,
                                        payment: formData.payment
                                    })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.code === 200) {
                                        message.success('Thanh toán PayPal thành công!');
                                        handleNavigateSuccessOrder();
                                    } else {
                                        message.error('Thanh toán PayPal thất bại: ' + data.message);
                                    }
                                })
                                .catch(error => {
                                    message.error('Có lỗi xảy ra khi xử lý thanh toán');
                                    console.error("Error processing transaction:", error);
                                });
                            }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: (totalPrice/25000).toFixed(2)
                                            },
                                        },
                                    ],
                                });
                            }}
                            onError={(err) => {
                                message.error('Có lỗi xảy ra khi thanh toán PayPal');
                                console.error("Payment Error:", err);
                            }}
                        />
                    ) : (
                        <Button 
                            className='btn-buy'
                            onClick={handleSubmitOrder}
                            type="primary"
                            size="large"
                            block
                            style={{ 
                                height: '50px',
                                fontSize: '16px',
                                marginTop: '20px',
                                backgroundColor: '#1890ff',
                                borderColor: '#1890ff',
                                boxShadow: '0 2px 0 rgba(24,144,255,0.1)'
                            }}
                        >
                            Đặt hàng ngay
                        </Button>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default InfoOrder;