import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth } from '@/lib/firebase';
import { fetchProducts } from '../product/productSlice';

export const submitRating = createAsyncThunk(
    'rating/submitRating',
    async ({ productId, rating, reviewText }, { dispatch, rejectWithValue }) => {
        const user = auth.currentUser;
        if (!user) {
            return rejectWithValue('You must be logged in to submit a rating.');
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
                throw new Error(errorData.error || 'Failed to submit rating.');
            }
            
            const data = await response.json();
            // After submitting, re-fetch all products to get the updated ratings globally
            dispatch(fetchProducts()); 
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
        loading: false,
        error: null,
    },
    reducers: {
        addRating: (state, action) => {
            // Not used with thunks, but kept for potential synchronous additions
            const existingIndex = state.ratings.findIndex(r => r.productId === action.payload.productId && r.userId === action.payload.userId);
            if (existingIndex !== -1) {
                state.ratings[existingIndex] = action.payload;
            } else {
                state.ratings.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitRating.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(submitRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { addRating } = ratingSlice.actions

export default ratingSlice.reducer