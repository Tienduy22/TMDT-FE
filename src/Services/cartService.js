import axios from "axios";

export const cartGet = async (userId) => {
    const res = await axios.get(
        `http://localhost:3000/api/v1/client/cart/${userId}`
    );
    return res.data;
};

export const cartUpdate = async (userId, product) => {
    const res = await axios.patch(
        `http://localhost:3000/api/v1/client/cart/update/${userId}`,
        { product }
    );
    return res.data;
};

export const cartDelete = async (userId, productId) => {
    const res = await axios.patch(
        `http://localhost:3000/api/v1/client/cart/delete/${userId}`,
        {
            data: { productId },
        }
    );
    return res.data;
};
