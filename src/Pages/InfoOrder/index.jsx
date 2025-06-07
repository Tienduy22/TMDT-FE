import "./InfoOrder.scss";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Input, Radio } from "antd";
import { useEffect, useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { deleteAllCart } from "../../Redux/reducers/cartUserReducer";
import { deleteAllOrder } from "../../Redux/reducers/orderReducer";
import * as CartService from "../../Services/cartService";
import * as OrderService from "../../Services/orderService";
import * as ProductService from "../../Services/productService";
const { TextArea } = Input;

const InfoOrder = () => {
    const order = useSelector((state) => state.order);
    const cartUser = useSelector((state) => state.cartUser);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = useState(user.fullName);
    const [address, setAddress] = useState(user.address);
    const [phone, setPhone] = useState(user.phone);
    const [email, setEmail] = useState(user.email);
    const [note, setNote] = useState();
    const [payment, setPayment] = useState();
    const [itemOrder, setItemOrder] = useState([]);
    const [userId, setUserId] = useState(""); // Sử dụng state để quản lý userId

    useEffect(() => {
        if (user.token) {
            setUserId(jwtDecode(user.token).id);
            setItemOrder(cartUser.cartItems);
        } else {
            setUserId("");
            setItemOrder(order.orderItems);
        }
    }, [user.token, cartUser.cartItems, order.orderItems]); // Thêm dependencies

    const totalPrice =
        order?.orderItems?.reduce(
            (total, item) => total + item.price * item.amount,
            0
        ) || 0;

    const style = {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    };

    const handleName = (e) => setName(e.target.value);
    const handleAddress = (e) => setAddress(e.target.value);
    const handlePhone = (e) => setPhone(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handleNote = (e) => setNote(e.target.value);
    const handlePayment = (e) => {
        setPayment(e.target.value);
    };
    const hanldeSubmit = async () => {
        const data = {
            userId,
            infoUser: {
                name,
                address,
                phone,
                email,
                note,
            },
            product: itemOrder,
            totalPrice,
            payment,
            status: "waiting",
        };
        const res = await OrderService.CashOnDelivery(data)
        if (res.code === 200) {
            await ProductService.updateStock(itemOrder)
            dispatch(deleteAllOrder());
            navigate("/success-order");
        }
    };
    const handleNavigateSuccessOrder = async () => {
        if (user.fullName) {
            await CartService.cartDeleteItem(userId);
            dispatch(deleteAllCart());
        } else {
            dispatch(deleteAllOrder());
        }

        navigate("/success-order");
    };

    return (
        <Row
            gutter={[5, 5]}
            className="container-infoOrder"
            style={{ fontFamily: "Roboto" }}
        >
            <Col span={14} style={{ paddingRight: 40, fontSize: 18 }}>
                <div className="info">
                    <p className="title">Thông tin thanh toán</p>
                    <div className="info-text">
                        <p>Họ và Tên:</p>
                        <Input
                            placeholder="Họ và tên ..."
                            defaultValue={user.fullName}
                            onChange={handleName}
                        />
                    </div>
                    <div className="info-text">
                        <p>Địa chỉ:</p>
                        <Input
                            placeholder="Địa chỉ ..."
                            defaultValue={user.address}
                            onChange={handleAddress}
                        />
                    </div>
                    <div className="info-text">
                        <p>Số điện thoại:</p>
                        <Input
                            placeholder="Số điện thoại ..."
                            defaultValue={user.phone}
                            onChange={handlePhone}
                        />
                    </div>
                    <div className="info-text">
                        <p>Email:</p>
                        <Input
                            placeholder="Email ..."
                            defaultValue={user.email}
                            onChange={handleEmail}
                        />
                    </div>
                    <div className="info-text">
                        <p>Thông tin bổ sung:</p>
                        <TextArea
                            placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn..."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            onChange={handleNote}
                        />
                    </div>
                </div>
            </Col>
            <Col
                span={10}
                className="order"
                style={{ fontSize: 24, paddingLeft: 40, paddingRight: 40 }}
            >
                <p className="title-order">Đơn hàng của bạn</p>
                <Row gutter={[10, 10]} className="order1">
                    <Col span={18}>
                        <p className="order1-text1">SẢN PHẨM</p>
                    </Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                        <p className="order1-text2">TẠM TÍNH</p>
                    </Col>
                </Row>
                {itemOrder.map((item) => (
                    <Row
                        gutter={[10, 10]}
                        style={{
                            paddingBottom: 10,
                            opacity: 0.6,
                            paddingTop: 10,
                        }}
                    >
                        <Col span={18}>
                            {item.name} x {item.amount}
                        </Col>
                        <Col span={6} style={{ textAlign: "right" }}>
                            {(item.price * item.amount).toLocaleString()} đ
                        </Col>
                    </Row>
                ))}
                <Row gutter={[10, 10]} className="order2">
                    <Col
                        span={18}
                        style={{ fontFamily: "Roboto", fontSize: 18 }}
                    >
                        Tổng
                    </Col>
                    <Col
                        span={6}
                        style={{
                            textAlign: "right",
                            fontFamily: "Roboto",
                            fontSize: 18,
                            color: "#c02b2b",
                        }}
                    >
                        {totalPrice.toLocaleString()}đ
                    </Col>
                </Row>
                <div className="payment">
                    <p>Phương thức thanh toán</p>
                    <div className="payment-option">
                        <Radio.Group
                            style={style}
                            onChange={handlePayment}
                            options={[
                                {
                                    value: "cash-on-delivery",
                                    label: "Thanh toán khi nhận hàng",
                                },
                                { value: "paypal", label: "Thanh toán PAYPAL" },
                                { value: "vnpay", label: "Thanh toán VNPAY" },
                            ]}
                        />
                    </div>
                </div>
                {payment === "paypal" ? (
                    <PayPalButton
                        amount={(totalPrice / 25000).toFixed(2)} // Quy đổi sang USD
                        shippingPreference="NO_SHIPPING"
                        options={{
                            clientId: "YOUR_PAYPAL_CLIENT_ID", // Thay bằng clientId thực tế
                            currency: "USD",
                        }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: (totalPrice / 25000).toFixed(
                                                2
                                            ),
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                                console.log(
                                    "Transaction completed by ",
                                    details.payer.name.given_name
                                );
                                console.log(
                                    "Payer ID:",
                                    details.payer.payer_id
                                );
                                return fetch(
                                    "http://localhost:3000/api/v1/client/order/paypal-transaction-complete",
                                    {
                                        method: "post",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            orderID: data.orderID,
                                            userId,
                                            infoUser: {
                                                name,
                                                address,
                                                phone,
                                                email,
                                                note,
                                            },
                                            product: itemOrder,
                                            totalPrice,
                                            payment,
                                            status: "waiting",
                                        }),
                                    }
                                )
                                    .then((response) => response.json())
                                    .then((data) => {
                                        if (data.code === 200) {
                                            handleNavigateSuccessOrder();
                                        } else {
                                            console.log(
                                                "Transaction failed:",
                                                data
                                            );
                                        }
                                    })
                                    .catch((error) =>
                                        console.error(
                                            "Error processing transaction:",
                                            error
                                        )
                                    );
                            });
                        }}
                        onError={(err) => {
                            console.error("Payment Error:", err);
                            alert(
                                "An error occurred with PayPal. Please try again."
                            );
                        }}
                    />
                ) : (
                    <Button className="btn-buy" onClick={hanldeSubmit}>
                        Đặt hàng ngay
                    </Button>
                )}
            </Col>
        </Row>
    );
};

export default InfoOrder;
