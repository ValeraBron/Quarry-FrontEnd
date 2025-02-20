import { configureStore } from "@reduxjs/toolkit"
import authReducer from './authSlice'
import notificationReducer from "./notificationSlice";
import clientReducer from './clientSlice'
import messageReducer from './messageSlice'

const appStore = configureStore({
    reducer: {
        auth: authReducer,
        notification: notificationReducer,
        client: clientReducer,
        message: messageReducer
    }
})

export default appStore;