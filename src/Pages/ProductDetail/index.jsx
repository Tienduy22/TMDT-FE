import { Col, Row } from 'antd';
import { Button } from 'antd';
import { Flex } from 'antd';
import { SafetyOutlined, TruckOutlined, SolutionOutlined, InboxOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.scss';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../../Redux/reducers/orderReducer';
import { InputNumber, Rate } from 'antd';
import { jwtDecode } from "jwt-decode";
import * as cartService from "@/Services/cartService"
import { message } from 'antd';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(1)
    const [rating, setRating] = useState(0)
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    let user_id
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
        if (!product || !product._id || !product.title || !product.thumbnail || !product.price) {
            message.error('Thông tin sản phẩm không hợp lệ');
            return;
        }

        const orderItem = {
            name: product.title.toUpperCase(),
            amount: amount,
            image: product.thumbnail,
            price: product.price,
            product_id: product._id,
            id: product._id
        }

        if (!user_id) {
            dispatch(addOrder({
                orderItem
            }));
            message.success('Đã thêm sản phẩm vào giỏ hàng');
        } else {
            const addCart = async () => {
                try {
                    await cartService.cartUpdate(user_id, orderItem);
                    message.success('Đã thêm sản phẩm vào giỏ hàng');
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    message.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
                }
            }
            addCart();
        }
    }


    const onChangeNumber = (value) => {
        setAmount(parseInt(value))
    };

    const color = product.color.split(",")

    return (
        <div>
            <Row>
                <Col span={2}></Col>
                <Col span={20} className='product-detail'>
                    <Row gutter={[30, 30]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className='product-image'>
                            <img src={product.thumbnail} alt={product.title} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className='product-info'>
                            <h2 className='title'>{product.title}</h2>
                            <p className='description'>{product.description}</p>
                            <p className='price'>{product.price?.toLocaleString()} đ</p>
                            <div className='color-option'> Màu sắc:
                                {color.map((item, index) => (
                                    <div key={index}>
                                        {item.trim() === "Xanh dương" ? (
                                            <div className='color' style={{ backgroundColor: "#0396FF" }}></div>
                                        ) : ""}
                                        {item.trim() === "Trắng" ? (
                                            <div className='color' style={{ backgroundColor: "white" }}></div>
                                        ) : ""}
                                        {item.trim() === "Tím" ? (
                                            <div className='color' style={{ backgroundColor: "#BC78EC" }}></div>
                                        ) : ""}

                                    </div>
                                ))}
                            </div>
                            <div className="amount-control" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                                <div style={{ fontSize: 22, fontWeight: 500 }}>Số lượng</div>
                                <InputNumber
                                    size='large'
                                    className="amount"
                                    min={1}
                                    max={100}
                                    defaultValue={1}
                                    onChange={onChangeNumber}
                                    style={{ width: 60 }}
                                />
                            </div>


                            <Flex wrap gap="small" style={{ paddingTop: 20 }}>
                                <Button
                                    style={{
                                        backgroundColor: '#e63946',
                                        color: 'white',
                                        padding: '10px 20px',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        borderRadius: 8,
                                        border: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        transition: 'all 0.3s',
                                    }}
                                    onMouseEnter={e => (e.target.style.backgroundColor = '#d62828')}
                                    // onClick={handleClickBuy}
                                >
                                    Mua ngay
                                </Button>

                                <Button
                                    style={{
                                        backgroundColor: '#457b9d',
                                        color: 'white',
                                        padding: '10px 20px',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        borderRadius: 8,
                                        border: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        transition: 'all 0.3s',
                                    }}
                                    onMouseEnter={e => (e.target.style.backgroundColor = '#1d3557')}
                                    onClick={handleClickCart}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                            </Flex>


                            <div className="product-service" style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <Row gutter={[15, 15]}>
                                    <Col span={12} style={{ paddingTop: 20, paddingBottom: 20 }}>
                                        <SafetyOutlined className='service' style={{ fontSize: 30 }} />Bảo hành 12 tháng tận nơi
                                    </Col>
                                    <Col span={12} style={{ paddingTop: 20, paddingBottom: 20 }}>
                                        <TruckOutlined className='service' style={{ fontSize: 30 }} /> Free Ship toàn quốc từ 498k
                                    </Col>
                                </Row>
                                <Row gutter={[15, 15]}>
                                    <Col span={12}>
                                        <SolutionOutlined className='service' style={{ fontSize: 30 }} /> Hoàn trả nếu không hài lòng
                                    </Col>
                                    <Col span={12}>
                                        <InboxOutlined className='service' style={{ fontSize: 30 }} /> Kiểm tra trước khi thanh toán
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={2}></Col>
            </Row>

            {/* Product Review Section */}
            <div className="product-reviews">
                <h3>Đánh giá sản phẩm</h3>

                {/* Review Submission Form */}
                <div className="review-form">
                    <h4>Viết đánh giá của bạn</h4>
                    <Row gutter={[0, 20]}>
                        <Col span={24} >
                            <div className="review-rating" >
                                <span style={{ paddingLeft: 10 }}>Đánh giá của bạn:</span>
                                <Rate
                                    allowHalf
                                    value={rating}
                                    onChange={setRating}
                                    className="rating-stars"
                                />
                            </div>
                        </Col>
                        <Col span={24}>
                            <textarea className="review-comment-input" placeholder="Nhập nhận xét của bạn..."></textarea>
                        </Col>
                        <Col span={24}>
                            <button className="review-submit-button">Gửi đánh giá</button>
                        </Col>
                    </Row>
                </div>

                {/* Existing Reviews List */}
                <div className="reviews-list">
                    <h4>Các đánh giá khác</h4>
                    <Row gutter={[0, 20]}>
                        {/* Placeholder Review Item */}
                        <Col span={24}>
                            <div className="review-item">
                                <div className="reviewer-info">
                                    <span className="reviewer-name">Người dùng A</span>
                                    <Rate disabled defaultValue={4} className="rating-stars" />
                                </div>
                                <p className="review-comment">Sản phẩm rất tốt, tôi rất hài lòng!</p>
                                <span className="review-date">Ngày: 01/01/2023</span>
                            </div>
                        </Col>
                        {/* Placeholder Review Item */}
                        <Col span={24}>
                            <div className="review-item">
                                <div className="reviewer-info">
                                    <span className="reviewer-name">Người dùng B</span>
                                    <Rate disabled defaultValue={5} className="rating-stars" />
                                </div>
                                <p className="review-comment">Chất lượng sản phẩm tuyệt vời.</p>
                                <span className="review-date">Ngày: 05/01/2023</span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Suggested Products Section */}
            <div className="suggested-products">
                <h3>Sản phẩm tương tự</h3>
                <Row gutter={[20, 20]}>
                    {[1, 2, 3, 4].map((item) => (
                        <Col xs={24} sm={12} md={6} key={item}>
                            <div className="suggested-product-card">
                                <div className="product-image">
                                    <img src="https://via.placeholder.com/200" alt="Suggested product" />
                                </div>
                                <div className="product-info">
                                    <h4 className="product-title">Sản phẩm tương tự {item}</h4>
                                    <p className="product-price">1.000.000 đ</p>
                                    <div className="product-rating">
                                        <Rate disabled defaultValue={4} className="rating-stars" />
                                        <span className="rating-count">(24)</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}

export default ProductDetail;