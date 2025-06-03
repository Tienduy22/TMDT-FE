import React from "react";
import { Card, Rate } from "antd";
import "./CardProduct.scss";

const CardProducts = (props) => {
    const { img, title, price, rate } = props;

    return (
        <Card
            hoverable
            style={{ width: 300 }}
            cover={<img alt={title} src={img} />}
        >
            <div className="card-title">{title}</div>
            <div className="card-rate">
                <Rate defaultValue={rate} />
            </div>
            <div className="card-price">{price ? price.toLocaleString() : "0"}đ</div>
        </Card>
    );
};

export default CardProducts;
