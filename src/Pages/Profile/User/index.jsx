import { useEffect, useState } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Avatar,
    Divider,
    Space,
    Select,
    message,
} from "antd";
import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import axios from "axios";
import * as UserService from "@/Services/userService";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [addressApi, setAddressApi] = useState();
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const user = useSelector((state) => state.user);
    const decode = jwtDecode(user.token);

    const [formData, setFormData] = useState({
        address: user?.address,
    });

    const userInfo = {
        name: user?.fullName,
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
    };

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
        setFormData((prev) => ({
            ...prev,
            address: "" + e + " / ",
        }));
        const result = addressApi.filter((item) => item.name === e);
        setProvince(result[0]);
    };

    const handleChangeDistrict = (e) => {
        setFormData((prev) => ({
            ...prev,
            address: prev.address + e + " / ",
        }));
        const result = province.districts.filter((item) => item.name === e);
        setDistrict(result[0]);
    };

    const handleChangeCommune = (e) => {
        setFormData((prev) => ({
            ...prev,
            address: prev.address + e,
        }));
        form.setFieldsValue({ address: formData.address + e });
    };

    const handleEdit = () => {
        setIsEditing(true);
        form.setFieldsValue(userInfo);
    };

    const handleSave = async (e) => {
        const res = await UserService.updateUser(decode.id, e);
        if (res.code === 200) {
            message.success("Cập nhật thành công");
            setTimeout(() => {
                window.location.reload(); // 🔁 delay reload
            }, 700);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        form.resetFields();
    };

    return (
        <div className="profile-container">
            <Card
                title="Hồ sơ cá nhân"
                extra={
                    !isEditing && (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                        >
                            Chỉnh sửa
                        </Button>
                    )
                }
                className="profile-card"
            >
                <div className="profile-header">
                    <Avatar
                        size={80}
                        icon={<UserOutlined />}
                        className="profile-avatar"
                    />
                    <div className="profile-info">
                        <h3>{userInfo.name}</h3>
                        <p className="profile-email">{userInfo.email}</p>
                    </div>
                </div>

                <Divider />

                {!isEditing ? (
                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="detail-label">Họ và tên:</span>
                            <span className="detail-value">
                                {userInfo.name}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">
                                {userInfo.email}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Số điện thoại:</span>
                            <span className="detail-value">
                                {userInfo.phone}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Địa chỉ:</span>
                            <span className="detail-value">
                                {userInfo.address}
                            </span>
                        </div>
                    </div>
                ) : (
                    <Form form={form} layout="vertical" onFinish={handleSave}>
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập họ tên!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Vui lòng nhập email hợp lệ!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số điện thoại!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="address" label="Địa chỉ">
                            <Select
                                showSearch
                                placeholder="Tỉnh/Thành phố ..."
                                style={{ width: 160, marginRight: 20 }}
                                onChange={handleChangeProvince}
                                options={addressApi?.map((address) => ({
                                    value: address.name,
                                    label: address.name,
                                }))}
                            />
                            <Select
                                showSearch
                                placeholder="Quận/Huyện ..."
                                style={{ width: 160, marginRight: 20 }}
                                onChange={handleChangeDistrict}
                                options={province?.districts?.map(
                                    (address) => ({
                                        value: address.name,
                                        label: address.name,
                                    })
                                )}
                            />
                            <Select
                                showSearch
                                placeholder="Xã/Phường ..."
                                style={{ width: 160, marginRight: 20 }}
                                onChange={handleChangeCommune}
                                options={district?.wards?.map((address) => ({
                                    value: address.name,
                                    label: address.name,
                                }))}
                            />
                            <Input.TextArea
                                rows={3}
                                value={formData.address}
                                style={{marginTop:20}}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        address: e.target.value,
                                    }))
                                }
                            />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                >
                                    Lưu thay đổi
                                </Button>
                                <Button onClick={handleCancel}>Hủy</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default UserProfile;
