'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth } from '@/lib/firebase';
import { fetchProducts } from '../product/productSlice';

export const addRating = createAsyncThunk(
    'ratings/addRating',
    async ({ productId, rating, reviewText }, { dispatch, rejectWithValue }) => {
        const user = auth.currentUser;
        if (!user) {
            return rejectWithValue('You must be logged in to leave a review.');
        }

        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ productId, rating, reviewText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit review.');
            }
            
            const newRating = await response.json();
            // Refetch products to update the UI with the new rating
            dispatch(fetchProducts());
            return newRating;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateRating = createAsyncThunk(
    'ratings/updateRating',
    async ({ productId, rating, reviewText }, { dispatch, rejectWithValue }) => {
        const user = auth.currentUser;
        if (!user) return rejectWithValue('You must be logged in to update a review.');

        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/api/ratings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ productId, rating, reviewText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update review.');
            }
            
            const updatedRating = await response.json();
            // Refetch products to update the UI with the edited rating
            dispatch(fetchProducts()); 
            return updatedRating;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const ratingSlice = createSlice({
    name: 'ratings',
    initialState: {
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addRating.pending, (state) => {
                state.loading = true;
            })
            .addCase(addRating.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateRating.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRating.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default ratingSlice.reducer;