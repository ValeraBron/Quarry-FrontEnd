import { configureStore } from "@reduxjs/toolkit"
import authReducer from './authSlice'
import notificationReducer from "./notificationSlice";
import clientReducer from './clientSlice'
import messageReducer from './messageSlice'

const appStore = configureStore({
    reducer: {
        auth: authReducer,
        client: clientReducer,
        message: messageReducer,
        notification: notificationReducer
    }
})

export default appStore;