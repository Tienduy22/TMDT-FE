import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderItems: [],
    shippingAddress: [],
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            const { orderItem } = action.payload;
            
            // Validate order item
            if (!orderItem || !orderItem.product_id || !orderItem.name || !orderItem.price) {
                console.error('Invalid order item:', orderItem);
                return;
            }

            const itemOrder = state?.orderItems?.find((item) => {
                const itemId = item?.product_id || item?.id;
                const orderItemId = orderItem.product_id || orderItem.id;
                return itemId === orderItemId;
            });

            if (itemOrder) {
                const newAmount = itemOrder.amount + parseInt(orderItem?.amount || 1);
                if (newAmount <= 10) {
                    itemOrder.amount = newAmount;
                }
            } else {
                // Ensure all required fields are present
                const newOrderItem = {
                    ...orderItem,
                    id: orderItem.product_id, // Ensure id matches product_id
                    amount: parseInt(orderItem.amount || 1),
                    price: parseFloat(orderItem.price || 0)
                };
                state.orderItems.push(newOrderItem);
            }
        },

        updateOrderItems: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.orderItems = action.payload.map(item => ({
                    ...item,
                    id: item.product_id || item.id,
                    amount: parseInt(item.amount || 1),
                    price: parseFloat(item.price || 0)
                }));
            }
        },

        increaseAmount: (state, action) => {
            const { orderItem } = action.payload;
            if (!orderItem || !orderItem.product_id) return;

            const itemOrder = state?.orderItems?.find((item) => {
                const itemId = item?.product_id || item?.id;
                const orderItemId = orderItem.product_id || orderItem.id;
                return itemId === orderItemId;
            });

            if (itemOrder && itemOrder.amount < 10) {
                itemOrder.amount += 1;
            }
        },

        decreaseAmount: (state, action) => {
            const { orderItem } = action.payload;
            if (!orderItem || !orderItem.product_id) return;

            const itemOrder = state?.orderItems?.find((item) => {
                const itemId = item?.product_id || item?.id;
                const orderItemId = orderItem.product_id || orderItem.id;
                return itemId === orderItemId;
            });

            if (itemOrder && itemOrder.amount > 1) {
                itemOrder.amount -= 1;
            }
        },

        removeOrder: (state, action) => {
            const { orderItem } = action.payload;
            if (!orderItem || !orderItem.product_id) return;

            state.orderItems = state.orderItems.filter(item => {
                const itemId = item?.product_id || item?.id;
                const orderItemId = orderItem.product_id || orderItem.id;
                return itemId !== orderItemId;
            });
        },

        clearCart: (state) => {
            state.orderItems = [];
        }
    }
})

export const {
    addOrder,
    updateOrderItems,
    increaseAmount,
    decreaseAmount,
    removeOrder,
    clearCart
} = orderSlice.actions

export default orderSlice.reducer