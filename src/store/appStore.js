import { configureStore } from "@reduxjs/toolkit"
import authReducer from './authSlice'
import notificationReducer from "./notificationSlice";
import clientReducer from './clientSlice'
import messageReducer from './messageSlice'
import categoryReducer from './categorySlice'
import phoneReducer from './phoneSlice'
const appStore = configureStore({
    reducer: {
        auth: authReducer,
        client: clientReducer,
        message: messageReducer,
        notification: notificationReducer,
        category: categoryReducer,
        phone: phoneReducer
    }
})

export default appStore;