import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
    name: 'client',
    initialState: {
        data : []
    },
    reducers: {
        setClient: (state, action) => {
            state.data = action.payload;
        }
    }
})

export default clientSlice.reducer;
export const { setClient } = clientSlice.actions;