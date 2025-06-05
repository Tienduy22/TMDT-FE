import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND

export const OrderGet = async () => {
    const res = await axios.get(
        `${API}/client/order`
    );
    return res.data;
};

export const OrderDetail = async (order_id) => {
    const res = await axios.get(
        `${API}/client/order/detail/${order_id}`
    );
    return res.data;
};

export const OrderEdit = async (order_id,data) => {
    const res = await axios.patch(
        `${API}/client/order/edit/${order_id}`,data
    );
    return res.data;
};

export const OrderDelete = async (order_id) => {
    const res = await axios.delete(
        `${API}/client/order/delete/${order_id}`
    );
    return res.data;
};