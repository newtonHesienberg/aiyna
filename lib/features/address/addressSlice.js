import { createSlice } from '@reduxjs/toolkit'

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [], // Start with an empty list instead of dummy data
    },
    reducers: {
        // New reducer to set the entire address list
        setAddresses: (state, action) => {
            state.list = action.payload;
        },
        addAddress: (state, action) => {
            state.list.push(action.payload);
        },
        // You can also add reducers for updating and removing if needed
        updateAddress: (state, action) => {
            const index = state.list.findIndex(addr => addr.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        removeAddress: (state, action) => {
            state.list = state.list.filter(addr => addr.id !== action.payload);
        }
    }
})

export const { setAddresses, addAddress, updateAddress, removeAddress } = addressSlice.actions

export default addressSlice.reducer