import React from "react";
import { Cascader } from "antd";
import { Checkbox } from "antd";
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

    const optionsColor = [
        { value: "red", label: "Đỏ" },
        { value: "blue", label: "Xanh" },
        { value: "green", label: "Xanh lá" },
    ];

    const optionPriceRange = [
        { value: "0-500k", label: "Dưới 500k" },
        { value: "500k-1m", label: "Từ 500k đến 1 triệu" },
        { value: "1m-2m", label: "Từ 1 triệu đến 2 triệu" },
        { value: "2m-5m", label: "Từ 2 triệu đến 5 triệu" },
        { value: "5m+", label: "Trên 5 triệu" },
    ];

    const onChangeSort = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    };

    const onChangeMaterial = (e) => {
        console.log(`checked = ${e.target.checked}`);
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
                {optionsMaterial.map((option) => (
                    <div key={option.value} className="material-option">
                        <Checkbox onChange={onChangeMaterial}>
                            <p className="material">{option.label}</p>
                        </Checkbox>
                    </div>
                ))}
            </div>

            <div className="navbar-color">
                <h3>Màu sắc</h3>
                {optionsColor.map((option) => (
                    <div key={option.value} className="color-option">
                        <Checkbox onChange={onChangeMaterial}>
                            <p className="color">{option.label}</p>
                        </Checkbox>
                    </div>
                ))}
            </div>

            <div className="navbar-price-range">
                <h3>Mức giá</h3>
                {optionPriceRange.map((option) => (
                    <div key={option.value} className="price-range-option">
                        <Checkbox onChange={onChangeMaterial}>
                            <p className="price-range">{option.label}</p>
                        </Checkbox>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NavbarComponents;
