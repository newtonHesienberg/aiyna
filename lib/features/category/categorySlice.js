import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Thunk to fetch categories from the API
export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async () => {
        const response = await fetch('/api/categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories.');
        }
        const data = await response.json();
        return data;
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        list: [],
        loading: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default categorySlice.reducer;
