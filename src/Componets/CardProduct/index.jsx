import React from "react";
import { Card, Tag } from "antd";
import "./CardProduct.scss";

const CardProducts = (props) => {
  const { img, title, price, discount } = props;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Card
      hoverable
      className="product-card"
      cover={
        <div className="product-image-container">
          <img
            alt={title}
            src={img}
            className="product-image"
          />
          {discount && (
            <Tag color="#ff4d4f" className="discount-badge">
              -{discount}%
            </Tag>
          )}
        </div>
      }
    >
      <div className="product-info">
        <div className="card-title" title={title}>{title}</div>
        <div className="price-container">
          <div className="card-price">{formatPrice(price)}</div>
          {discount && (
            <div className="original-price">
              {formatPrice(price * (1 + discount/100))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CardProducts;
