'use client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firebase';

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        const user = auth.currentUser;
        if (!user) {
            return rejectWithValue('No user logged in');
        }
        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/api/wishlist', {
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }
            const data = await response.json();
            // The API returns an array of product objects, so we extract their IDs
            return data.map(product => product.id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        setWishlist: (state, action) => {
            state.items = action.payload;
        },
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
        clearWishlist: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;