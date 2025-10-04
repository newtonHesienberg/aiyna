import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth } from '@/lib/firebase';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        const user = auth.currentUser;
        if (!user) {
            return rejectWithValue('No user logged in');
        }
        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            const data = await response.json();
            // Normalize data for the Redux store
            const cartData = data.reduce((acc, item) => {
                acc[item.id] = {
                    cartItemId: item.id,
                    productId: item.product.id,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                };
                return acc;
            }, {});
            return cartData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addToCartAPI = createAsyncThunk(
    'cart/addToCartAPI',
    async ({ productId, color, size, quantity = 1 }, { getState, rejectWithValue }) => {
        const user = auth.currentUser;
        if (!user) {
            return rejectWithValue('You must be logged in to add items to the cart.');
        }

        const { cart: { cartItems } } = getState();

        const existingItem = Object.values(cartItems).find(
          (item) =>
            item.productId === productId &&
            item.color === (color || null) &&
            item.size === (size || null)
        );

        try {
            const idToken = await user.getIdToken();
            let response;
            if (existingItem) {
                // Update quantity
                response = await fetch('/api/cart', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ cartItemId: existingItem.cartItemId, quantity: existingItem.quantity + quantity }),
                });
            } else {
                // Add new item
                response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ productId, color, size, quantity }),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to update cart.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: {},
        loading: false,
        error: null,
    },
    reducers: {
        setCart: (state, action) => {
            state.cartItems = action.payload;
        },
        deleteItemFromCart: (state, action) => {
            const { itemId } = action.payload;
            delete state.cartItems[itemId];
        },
        clearCart: (state) => {
            state.cartItems = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCartAPI.fulfilled, (state, action) => {
                const item = action.payload;
                state.cartItems[item.id] = {
                    cartItemId: item.id,
                    productId: item.product_id,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                };
            });
    }
})

export const { setCart, deleteItemFromCart, clearCart } = cartSlice.actions

export default cartSlice.reducer