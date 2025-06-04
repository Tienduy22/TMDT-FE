import {useState} from "react";
import { Cascader } from "antd";
import { Radio } from "antd";
import "./NavbarComponents.scss";

const NavbarComponents = () => {
    const optionsSort = [
        { value: "price-asc", label: "Sắp xếp giá tăng dần" },
        { value: "price-desc", label: "Sắp xếp giá giảm dần" },
        { value: "name-asc", label: "Sắp xếp theo tên A-Z" },
        { value: "name-desc", label: "Sắp xếp theo tên Z-A" },
    ];

    const optionsMaterial = [
        { value: "silver", label: "Bạc" },
        { value: "gold", label: "Vàng" },
        { value: "platinum", label: "Bạch kim" },
    ];

    const optionPriceRange = [
        { value: "0-500k", label: "Dưới 500k" },
        { value: "500k-1m", label: "Từ 500k đến 1 triệu" },
        { value: "1m-2m", label: "Từ 1 triệu đến 2 triệu" },
        { value: "2m-5m", label: "Từ 2 triệu đến 5 triệu" },
        { value: "5m+", label: "Trên 5 triệu" },
    ];

    const [selectedMaterial, setSelectedMaterial] = useState(""); 
    const [selectedPriceRange, setSelectedPriceRange] = useState(""); 

    const onChangeMaterial = (e) => {
        setSelectedMaterial(e.target.value);  
    };

    const onChangePriceRange = (e) => {
        setSelectedPriceRange(e.target.value); 
    };

    const onChangeSort = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    };

    return (
        <div className="navbar">
            <Cascader
                options={optionsSort}
                onChange={onChangeSort}
                placeholder="Please select"
                onSearch={(value) => console.log(value)}
            />

            <div className="navbar-material">
                <h3>Chất liệu</h3>
                <Radio.Group
                    onChange={onChangeMaterial}
                    value={selectedMaterial}
                >
                    {optionsMaterial.map((option) => (
                        <div key={option.value} className="material-option">
                            <Radio value={option.value}>
                                <p className="material">{option.label}</p>
                            </Radio>
                        </div>
                    ))}
                </Radio.Group>
            </div>

            <div className="navbar-price-range">
                <h3>Mức giá</h3>
                <Radio.Group onChange={onChangePriceRange} value={selectedPriceRange}>
                {optionPriceRange.map((option) => (
                    <div key={option.value} className="price-range-option">
                        <Radio value={option.value}>
                            <p className="price-range">{option.label}</p>
                        </Radio>
                    </div>
                ))}
            </Radio.Group>
            </div>
        </div>
    );
};

export default NavbarComponents;
