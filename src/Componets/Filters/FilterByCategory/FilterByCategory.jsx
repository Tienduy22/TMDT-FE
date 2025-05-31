import * as ProductService from "../../../Services/productService"
import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import "./FilterByCategory.scss"

function FilterByCategory({ onChange }) {
    const [categories, setCategory] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await ProductService.productCategoryGet();
                setCategory(res);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchProduct();
    }, []);

    const handleClick = (category) => {
        if (onChange) {
            onChange(category._id);
            setActiveCategory(category._id);
        }
    };

    return (
        <Row className="product-list-title">
            {categories.map((category) => (
                <Col span={24 / categories.length} key={category._id}>
                    <div 
                        className={`product-title ${activeCategory === category._id ? 'active' : ''}`}
                        onClick={() => handleClick(category)}
                    >
                        {category.title}
                    </div>
                </Col>
            ))}
        </Row>
    );
}

export default FilterByCategory;