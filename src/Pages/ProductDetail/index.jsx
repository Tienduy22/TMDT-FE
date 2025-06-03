import { Col, Row } from 'antd';
import { Button } from 'antd';
import { Flex } from 'antd';
import { SafetyOutlined,TruckOutlined,SolutionOutlined,InboxOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.scss';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../../Redux/reducers/orderReducer';
import { InputNumber } from 'antd';
import { jwtDecode } from "jwt-decode";
import * as cartService from "@/Services/cartService"
import CommentProduct from '../../Componets/Comment';
import RecommendProducts from '../../Componets/RecommendProducts';


function ProductDetail() {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(1)
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    let user_id
    if(user.token){
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
            }
        if(!user_id){
            dispatch(addOrder({
                orderItem
            }))
        } else {
            const addCart = async () => {
                const res = cartService.cartUpdate(user_id,orderItem)
            }
            addCart()
        }
    }


    const onChangeNumber = (value) => {
        setAmount(parseInt(value))
    };

    const color = product.color.split(",")

    return (
        <div>
            <Row>
                <Col span={4}></Col>
                <Col span={16} className='product-detail'>
                    <Row gutter={[30, 30]}>
                        <Col span={12} className='product-image'>
                            <img src={product.thumbnail} alt={product.title}/>
                        </Col>
                        <Col span={12} className='product-info'>
                            <h2 className='title'>{product.title}</h2>
                            <p className='price'>{product.price} VND</p>
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
                            <InputNumber className='amount' min={1} max={10} defaultValue={1} onChange={onChangeNumber} />
                            <Flex wrap gap="small">
                                <Button className='btn-buy'>
                                    Mua ngay
                                </Button>
                                <Button className='add-cart' onClick={handleClickCart}>
                                    Thêm vào giỏ hàng
                                </Button>
                            </Flex>

                            <div className="product-service">
                                <Row gutter={[15,15]}>
                                    <Col span={12}>
                                        <SafetyOutlined className='service' style={{fontSize: 30}}/>Bảo hành 12 tháng tận nơi                             
                                    </Col>
                                    <Col span={12}>
                                        <TruckOutlined className='service' style={{fontSize: 30}}/> Free Ship toàn quốc từ 498k
                                    </Col>
                                </Row>
                                <Row gutter={[15,15]}>
                                    <Col span={12}>
                                        <SolutionOutlined className='service' style={{fontSize: 30}}/> Hoàn trả nếu không hài lòng
                                    </Col>
                                    <Col span={12}>
                                        <InboxOutlined className='service' style={{fontSize: 30}}/> Kiểm tra trước khi thanh toán
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <CommentProduct id={id} product={product} />
                    </Row>
                    {/* <Row>
                        <RecommendProducts product_id={product._id}  />
                    </Row> */}
                </Col>
                <Col span={4}></Col>
            </Row>
        </div>
    );
}

export default ProductDetail;