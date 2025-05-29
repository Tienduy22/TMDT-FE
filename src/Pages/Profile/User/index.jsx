import { useEffect, useState } from "react";
import "./User.scss";
import axios from "axios";
import { Select, Space } from "antd";
import * as UserService from "@/Services/userService";
import { useSelector } from "react-redux";
import { jwtDecode } from 'jwt-decode'; 

const User = () => {
    const [addressApi, setAddressApi] = useState();
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const user = useSelector((state) => state.user)

    const [formData, setFormData] = useState({
        name: user?.fullName,
        address: user?.address,
        phone: user.phone,
        email: user.email,
    });

    const decode = jwtDecode(user.token)


    useEffect(() => {
        const fetchDataAddress = async () => {
            const res = await axios.get(
                "https://provinces.open-api.vn/api/?depth=3"
            );
            setAddressApi(res.data);
        };
        fetchDataAddress();
    }, []);

    const handleChangeProvince = (e) => {
        setFormData(prev => ({
            ...prev,
            address: "" + e + " / "
        }))
        const result = addressApi.filter((item) => item.name === e);
        setProvince(result[0]);
    };

    const handleChangeDistrict = (e) => {
        setFormData(prev => ({
            ...prev,
            address: prev.address + e + " / "
        }))
        const result = province.districts.filter((item) => item.name === e);
        setDistrict(result[0]);
    };

    const handleChangeCommune = (e) => {
        setFormData(prev => ({
            ...prev,
            address: prev.address + e
        }))
    };

    const handleChange = async (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    const hanldeSaveInfo = async (e) => {
        e.preventDefault();
        const res = await UserService.updateUser(decode.id,formData)
    };


    return (
        <>
            <div className="user">
                <form action="" onSubmit={hanldeSaveInfo}>
                    <p className="name">
                        Họ và tên: {" "}
                        <span>
                            <input type="text" name="name" value={formData?.name} className="name-input" onChange={handleChange}/>
                        </span>
                    </p>
                    <p className="address">Địa chỉ: <span>{formData?.address}</span></p>
                    <p className="address-input" style={{marginLeft:20}}>
                        <Select
                            showSearch
                            placeholder="Tỉnh/Thành phố ..."
                            style={{ width: 160 , marginRight:20}}
                            onChange={handleChangeProvince}
                            options={addressApi?.map((address) => ({
                                value: address.name,
                                label: address.name,
                            }))}
                        />
                        <Select
                            showSearch
                            placeholder="Quận/Huyện ..."
                            style={{ width: 160, marginRight:20 }}
                            onChange={handleChangeDistrict}
                            options={province?.districts?.map((address) => ({
                                value: address.name,
                                label: address.name,
                            }))}
                        />
                        <Select
                            showSearch
                            placeholder="Xã/Phường ..."
                            style={{ width: 160, marginRight:20 }}
                            onChange={handleChangeCommune}
                            options={district?.wards?.map((address) => ({
                                value: address.name,
                                label: address.name,
                            }))}
                        />
                    </p>
                    <p className="phone">
                        Số điện thoại: {" "}
                        <span>
                            <input type="text" name="phone" value={formData?.phone} className="phone-input" onChange={handleChange}/>
                        </span>
                    </p>
                    <p className="email">
                        Email: {" "}
                        <span>
                            <input type="text" name="email" value={formData?.email} className="email-input" onChange={handleChange}/>
                        </span>
                    </p>
                    <button className="save">
                        Lưu
                    </button>
                </form>
            </div>
        </>
    );
};

export default User;
