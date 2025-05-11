import React from "react";
import { Card } from "antd";
import "./CardProduct.scss";

const CardProducts = (props) => {
  const { img, title, price } = props;
  return (
    <Card
      hoverable
      style={{ width: 300 }}
      cover={
        <img
          alt={title}
          src={img}
        />
      }
    >
      <div className="card-title">{title}</div>
      <div className="card-price">{price}đ</div>
    </Card>
  );
};

export default CardProducts;
