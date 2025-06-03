import { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import { TakeUserID } from "../TakeUserID";
import * as RecommendService from "../../Services/recommendService"

const { Meta } = Card;

function RecommendProducts(prop) {
    const [recommendProducts, setRecommendProducts] = useState([]);
    const infoUser = TakeUserID();
    const user_id = infoUser.user_id
    const product_id = prop.product_id

    const getRecommend = async() => {
        const res = await RecommendService.Recommend(user_id,product_id)
        setRecommendProducts(res)
    }

    useEffect(() => {
        getRecommend()
    }, []);

    if (recommendProducts.length === 0) return null;

    return (
        <div style={{ marginTop: 40 }}>
            <h3>Sản phẩm liên quan</h3>
            <Row gutter={[16, 16]}>
                {recommendProducts.map((item) => (
                    <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            cover={
                                <img alt={item.title} src={item.thumbnail} />
                            }
                            onClick={() =>
                                (window.location.href = `/products/${item._id}`)
                            }
                        >
                            <Meta
                                rate={item.rate_total}
                                title={item.title}
                                description={`${item.price} VND`}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default RecommendProducts;
