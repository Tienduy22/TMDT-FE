import "./InfoOrder.scss";
import { useSelector } from "react-redux";
import { Row, Col, Button, Input, Radio } from "antd";
import { useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const { TextArea } = Input;

const InfoOrder = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [address, setAddress] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [note, setNote] = useState();
    const [payment, setPayment] = useState();

    let userId;

    if (user.token) {
        userId = jwtDecode(user.token).id;
    } else {
        userId = "";
    }

    const totalPrice = order?.orderItems?.reduce((total, item) => {
        return total + item.price * item.amount;
    }, 0);

    const style = {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    };

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleAddress = (e) => {
        setAddress(e.target.value);
    };

    const handlePhone = (e) => {
        setPhone(e.target.value);
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleNote = (e) => {
        setNote(e.target.value);
    };

    const handlePayment = (e) => {
        console.log(e.target.value);
        setPayment(e.target.value);
    };

    const handleNavigateSuccessOrder = () => {
        navigate("/success-order");
    };

    return (
        <>
            <Row
                gutter={[5, 5]}
                className="container-infoOrder"
                style={{ fontFamily: "Roboto" }}
            >
                <Col span={14} style={{ paddingRight: 40, fontSize: 18 }}>
                    <div className="info">
                        <p className="title">Thông tin thanh toán</p>
                        <div className="info-text" onChange={handleName}>
                            <p>Họ và Tên:</p>
                            <Input placeholder="Họ và tên ..." />
                        </div>
                        <div className="info-text" onChange={handleAddress}>
                            <p>Địa chỉ:</p>
                            <Input placeholder="Địa chỉ ..." />
                        </div>
                        <div className="info-text" onChange={handlePhone}>
                            <p>Số điện thoại:</p>
                            <Input placeholder="Số điện thoại ..." />
                        </div>
                        <div className="info-text" onChange={handleEmail}>
                            <p>Email:</p>
                            <Input placeholder="Email ..." />
                        </div>
                        <div className="info-text" onChange={handleNote}>
                            <p>Thông tin bổ sung:</p>
                            <TextArea
                                placeholder=" Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn..."
                                autoSize={{ minRows: 3, maxRows: 5 }}
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
                    {order.orderItems.map((item) => {
                        return (
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
                                    {(
                                        item.price * item.amount
                                    ).toLocaleString()}
                                    đ
                                </Col>
                            </Row>
                        );
                    })}
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
                                        value: "0",
                                        label: "Thanh toán khi nhận hàng",
                                    },
                                    {
                                        value: "paypal",
                                        label: "Thanh toán PAYPAL",
                                    },
                                    {
                                        value: "vnpay",
                                        label: "Thanh toán VNPAY",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    {payment === "paypal" ? (
                        <PayPalButton
                            amount="0.01"
                            shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                            onSuccess={(details, data) => {
                                // OPTIONAL: Call your server to save the transaction
                                return fetch(
                                    "http://localhost:3000/api/v1/client/order/paypal-transaction-complete",
                                    {
                                        method: "post",
                                        headers: {
                                            "Content-Type": "application/json", // Đảm bảo rằng header này được thêm vào
                                        },
                                        body: JSON.stringify({
                                            orderID: data.orderID,
                                            userId: userId,
                                            infoUser: {
                                                name,
                                                address,
                                                phone,
                                                email,
                                                note,
                                            },
                                            product: order.orderItems,
                                            totalPrice: totalPrice,
                                            payment: payment,
                                        }),
                                    }
                                )
                                    .then((response) => response.json())
                                    .then((data) => {
                                        if (data.code === 200) {
                                            console.log(
                                                "Transaction completed:",
                                                data
                                            );
                                            handleNavigateSuccessOrder(); // Chuyển hướng nếu thành công
                                        } else {
                                            console.log(
                                                "Transaction failed:",
                                                data
                                            );
                                        }
                                    })
                                    .catch((error) => {
                                        console.error(
                                            "Error processing transaction:",
                                            error
                                        );
                                    });
                            }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: totalPrice / 25000, // Tổng tiền sản phẩm
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                console.log("onApprove called", data, actions);
                                return actions.order
                                    .capture()
                                    .then((details) => {
                                        console.log(
                                            "Transaction completed by ",
                                            details.payer.name.given_name
                                        );
                                        console.log(
                                            "Payer ID:",
                                            details.payer.payer_id
                                        );
                                        handleNavigateSuccessOrder();
                                    });
                            }}
                            onError={(err) => {
                                console.error("Payment Error:", err);
                            }}
                        />
                    ) : (
                        <Button className="btn-buy">Đặt hàng ngay</Button>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default InfoOrder;
