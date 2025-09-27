'use client';
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
    },
    reducers: {
        toggleWishlist: (state, action) => {
            const productId = action.payload;
            const index = state.items.indexOf(productId);
            if (index !== -1) {
                state.items.splice(index, 1);
                toast.success('Removed from Wishlist');
            } else {
                state.items.push(productId);
                toast.success('Added to Wishlist!');
            }
        },
        // --- NEW ACTION ---
        clearWishlist: (state) => {
            state.items = [];
        }
        // --- END OF NEW ACTION ---
    },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;