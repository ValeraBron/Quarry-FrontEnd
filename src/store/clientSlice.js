import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
    name: 'client',
    initialState: {
        data: [],
        phoneNumbers: [],
        categories: []
    },
    reducers: {
        setClients: (state, action) => {
            state.data = action.payload;
        },
        setPhoneNumbers: (state, action) => {
            state.phoneNumbers = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        }
    }
})

export default clientSlice.reducer;
export const { setClients, setPhoneNumbers, setCategories } = clientSlice.actions;