import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Thunk to fetch products from the API
export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async () => {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products.');
        }
        const data = await response.json();
        return data.products;
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        loading: true,
        error: null,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer