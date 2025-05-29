import * as ProductService from "../../../Services/productService"
import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import "./FilterByCategory.scss"

function FilterByCategory ({ onChange}){

    const [categories, setCategory] = useState([]);

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
    }, [])

    const handleClick = (category) =>{
        if(onChange){
            onChange(category._id)
        }
    }

    return(
        <>
            <Row className="product-list-title">
                {categories.map((category) => (
                    <Col span={24 / categories.length} key={category.id}>
                        <div className="product-title" onClick={() => handleClick(category)} >{category.title}</div>
                    </Col>
                ))}
            </Row>
        </>
    )
}
export default FilterByCategory;