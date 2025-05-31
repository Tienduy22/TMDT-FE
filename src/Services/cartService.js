import axios from "axios";

export const cartGet = async (userId) => {
    try {
        const res = await axios.get(
            `http://localhost:3000/api/v1/client/cart/${userId}`
        );
        return res.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const cartUpdate = async (userId, productId, amount) => {
    try {
        const res = await axios.patch(
            `http://localhost:3000/api/v1/client/cart/update/${userId}`,
            { 
                productId,
                amount: parseInt(amount) || 1
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
};

export const cartDelete = async (userId, productId) => {
    try {
        const res = await axios.patch(
            `http://localhost:3000/api/v1/client/cart/delete/${userId}`,
            {
                productId
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error deleting from cart:', error);
        throw error;
    }
};
