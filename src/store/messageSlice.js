import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        data: [],
        filters: {
            message: '',
            phoneNumber: '',
            optInStatus: null,
            categories: [],
            dateRange: {
                start: null,
                end: null
            }
        }
    },
    reducers: {
        setMessages: (state, action) => {
            state.data = action.payload;
        },
        setMessageFilter: (state, action) => {
            state.filters.message = action.payload;
        },
        setPhoneFilter: (state, action) => {
            state.filters.phoneNumber = action.payload;
        },
        setOptInStatusFilter: (state, action) => {
            state.filters.optInStatus = action.payload;
        },
        setCategoriesFilter: (state, action) => {
            state.filters.categories = action.payload;
        },
        setDateRangeFilter: (state, action) => {
            state.filters.dateRange = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {
                message: '',
                phoneNumber: '',
                optInStatus: null,
                categories: [],
                dateRange: {
                    start: null,
                    end: null
                }
            };
        }
    }
});

export const {
    setMessages,
    setMessageFilter,
    setPhoneFilter,
    setOptInStatusFilter,
    setCategoriesFilter,
    setDateRangeFilter,
    clearFilters
} = messageSlice.actions;

export default messageSlice.reducer;

// Selector to get filtered messages
export const selectFilteredMessages = (state) => {
    const messages = state.messages.data;
    const filters = state.messages.filters;

    return messages.filter(message => {
        const matchesMessage = !filters.message || 
            message.message?.toLowerCase().includes(filters.message.toLowerCase());
        
        const matchesPhone = !filters.phoneNumber || 
            message.phone_number?.includes(filters.phoneNumber);
        
        const matchesOptIn = filters.optInStatus === null || 
            message.opt_in_status === filters.optInStatus;
        
        const matchesCategories = filters.categories.length === 0 || 
            filters.categories.some(cat => message.categories?.includes(cat));
        
        const matchesDateRange = !filters.dateRange.start || !filters.dateRange.end || 
            (new Date(message.sent_timestamp) >= new Date(filters.dateRange.start) && 
             new Date(message.sent_timestamp) <= new Date(filters.dateRange.end));

        return matchesMessage && matchesPhone && matchesOptIn && 
               matchesCategories && matchesDateRange;
    });
}; 