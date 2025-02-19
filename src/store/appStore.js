import { configureStore } from "@reduxjs/toolkit"
import authReducer from './authSlice'
import notificationSlice from "./notificationSlice";
import clientSlice from './clientSlice'

const appStore = configureStore({
    reducer: {
        auth: authReducer,
        notification: notificationSlice,
        client: clientSlice
    }
})

export default appStore;