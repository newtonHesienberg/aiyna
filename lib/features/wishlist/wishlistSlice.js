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

export const toggleWishlistAPI = createAsyncThunk(
    'wishlist/toggleWishlistAPI',
    async (productId, { rejectWithValue }) => {
        const user = auth.currentUser;
        if (!user) {
            return rejectWithValue('You must be logged in to modify your wishlist.');
        }
        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ productId }),
            });
            if (!response.ok) {
                throw new Error('Failed to update wishlist.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const clearWishlistAPI = createAsyncThunk(
    'wishlist/clearWishlistAPI',
    async (_, { rejectWithValue }) => {
        const user = auth.currentUser;
        if (!user) {
            return rejectWithValue('No user logged in');
        }
        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/api/wishlist', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            if (!response.ok) {
                throw new Error('Failed to clear wishlist');
            }
            return;
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
            })
            .addCase(toggleWishlistAPI.fulfilled, (state, action) => {
                const { productId, action: toggleAction } = action.payload;
                if (toggleAction === 'added') {
                    state.items.push(productId);
                    toast.success('Added to Wishlist!');
                } else {
                    state.items = state.items.filter(id => id !== productId);
                    toast.success('Removed from Wishlist');
                }
            })
            .addCase(clearWishlistAPI.fulfilled, (state) => {
                state.items = [];
            });
    }
});

export const { setWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;