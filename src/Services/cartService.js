import axios from "axios";

const API = process.env.REACT_API_BACKEND

export const cartGet = async (userId) => {
    const res = await axios.get(
        `${API}/client/cart/${userId}`
    );
    return res.data;
};

export const cartUpdate = async (userId, product) => {
    const res = await axios.patch(
        `${API}/client/cart/update/${userId}`,
        { product }
    );
    return res.data;
};

export const cartDelete = async (userId, productId) => {
    const res = await axios.patch(
        `${API}/cart/delete/${userId}`,
        {
            data: { productId },
        }
    );
    return res.data;
};
