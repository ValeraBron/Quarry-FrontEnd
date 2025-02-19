import { configureStore, createSlice } from "@reduxjs/toolkit";

const verifyString = (str) => {
    return str === 'n/a' || str === '0' || str === '?' || str === 'N/A';
}


const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        data : [],
        sendTimer: 5
    },
    reducers: {
        setData: (state, action) => {
            const payloadData = action.payload;
            const obj = {}
            console.log("data", state.data);
            
            payloadData.forEach((newItem) => {
                let item = { ...newItem}
                if(verifyString(item.claim_number)) {
                    item.claim_number = 'N/A';
                }
                if(verifyString(item.project_name)) {
                    item.project_name = 'N/A';
                }
                
                if(!obj[item.customer_id]) {
                    obj[item.customer_id] = {
                        ...item,
                        data: [item]
                    }
                    obj[item.customer_id].review = Number(item.message_status == 1)
                    obj[item.customer_id].qued = Number(item.message_status == 2)
                    obj[item.customer_id].sent = Number(item.message_status == 3)
                } else {
                    const itemData = obj[item.customer_id];
                    itemData.data.push(item);
                    obj[item.customer_id].review += Number(item.message_status == 1)
                    obj[item.customer_id].qued += Number(item.message_status == 2)
                    obj[item.customer_id].sent += Number(item.message_status == 3)
                }
            })
            state.data = Object.values(obj) || [];
        },
        updateMessageStatus: (state, action) => {
            const { itemIndex, childIndex, newStatus } = action.payload;
            // Check if the itemIndex and childIndex are valid
            if (state.data[itemIndex] && state.data[itemIndex].data[childIndex]) {
                // Directly update the message_status using Immer's proxy state
                state.data[itemIndex].data[childIndex].message_status = newStatus;
            }
        },
        setSendTimer: (state, action) => {
            state.sendTimer = action.payload;
        },
    }
})

export default notificationSlice.reducer;
export const { setData, updateMessageStatus, setSendTimer } = notificationSlice.actions;