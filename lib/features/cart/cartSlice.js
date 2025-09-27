import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: {},
    },
    reducers: {
        // --- NEW ACTION ---
        addMultipleToCart: (state, action) => {
            const items = action.payload; // Expects an array of product objects
            items.forEach(product => {
                const { id, colors, sizes } = product;
                // Use the first available color and size as a default
                const color = colors?.[0] || 'default';
                const size = sizes?.[0] || 'default';
                const itemId = `${id}_${color}_${size}`;
                
                if (state.cartItems[itemId]) {
                    state.cartItems[itemId].quantity++;
                } else {
                    state.cartItems[itemId] = { productId: id, color, size, quantity: 1 };
                }
            });
        },
        // --- END OF NEW ACTION ---
        addToCart: (state, action) => {
            const { productId, color, size } = action.payload;
            const itemId = `${productId}_${color}_${size}`;
            if (state.cartItems[itemId]) {
                state.cartItems[itemId].quantity++;
            } else {
                state.cartItems[itemId] = { productId, color, size, quantity: 1 };
            }
        },
        removeFromCart: (state, action) => {
            const { itemId } = action.payload;
            if (state.cartItems[itemId] && state.cartItems[itemId].quantity > 1) {
                state.cartItems[itemId].quantity--;
            } else {
                delete state.cartItems[itemId];
            }
        },
        deleteItemFromCart: (state, action) => {
            const { itemId } = action.payload;
            delete state.cartItems[itemId];
        },
        clearCart: (state) => {
            state.cartItems = {};
        },
    }
})

export const { addMultipleToCart, addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer