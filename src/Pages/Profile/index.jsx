import React, { useState } from "react";
import { FileProtectOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, Row, Col } from "antd";
import User from "./User";
import "./Profile.scss"

const items = [
    {
        key: "1",
        icon: <UserOutlined />,
        label: "Tài khoản của tôi",
        children: [
            { key: "11", label: "Hồ sơ" },
            { key: "12", label: "Đổi mật khẩu" },
        ],
    },
    {
        key: "2",
        icon: <FileProtectOutlined />,
        label: "Đơn mua hàng",
    },
];

const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};

const levelKeys = getLevelKeys(items);

const Profile = () => {
    const [stateOpenKeys, setStateOpenKeys] = useState(["1", "11"]);

    const onOpenChange = (openKeys) => {
        const currentOpenKey = openKeys.find(
            (key) => stateOpenKeys.indexOf(key) === -1
        );
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex(
                    (key) => levelKeys[key] === levelKeys[currentOpenKey]
                );
            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter(
                        (key) => levelKeys[key] <= levelKeys[currentOpenKey]
                    )
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    return (
        <>
            <div className="profile">
                <Row style={{ margin: 50, paddingTop:20, paddingBottom:20 }}>
                    <Col>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={["231"]}
                            openKeys={stateOpenKeys}
                            onOpenChange={onOpenChange}
                            style={{ width: 256, marginRight: 20, border: "1.5px solid #e8e8e8", borderRadius: "6px", fontSize:15 }}
                            items={items}
                        />
                    </Col>
                    <Col
                        style={{
                            height: 530,
                            width: 840,
                            background: "#fff",
                            border: "1px solid #e8e8e8",
                            borderRadius: "6px",
                            paddingTop: 10,
                            paddingLeft: 40,
                            paddingRight: 40,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        <p style={{ fontSize: 24, fontFamily: "Roboto" }}>
                            Hồ sơ của tôi
                        </p>
                        <p
                            style={{
                                fontSize: 17,
                                fontFamily: "Roboto",
                                opacity: 0.7,
                                paddingBottom: 20,
                                borderBottom: ".1rem solid rgb(225, 219, 219)",
                            }}
                        >
                            Quản lý thông tin hồ sơ để bảo mật tài khoản
                        </p>

                        <User />
                    </Col>
                </Row>
            </div>
        </>
    );
};
export default Profile;
