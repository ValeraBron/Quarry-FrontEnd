const API = import.meta.env.VITE_API_URL

export const sendSms = async (message_id) => {
    try {
        const token = localStorage.getItem('access_token') || '';
        const res = await fetch(API+`send?message_id=${message_id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        const json = await res.json();
        // console.log({json})
        if (json.detail === "Could not validate credentials") {
            localStorage.removeItem('access_token');
        }
        return json;
    } catch (error) {
        console.log(error)
    }
}

export const getMessages = async () => {
    try {
        const token = localStorage.getItem('access_token') || '';
        const res = await fetch(API + `message-table`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const json = await res.json();
        // console.log({json})
        if (json.detail === "Could not validate credentials") {
            localStorage.removeItem('access_token');    
        }
        return json;
    } catch (error) {
        console.log(error)
    }
}

export const deleteMessage = async (message_id) => {
    try {
        const token = localStorage.getItem('access_token') || '';
        const res = await fetch(API + `delete-message?message_id=${message_id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const json = await res.json();
        // console.log({json})
        if (json.detail === "Could not validate credentials") {
            localStorage.removeItem('access_token');
        }
        return json;
    } catch (error) {
        console.log(error)
    }
}

export const addMessage = async (data) => {
    try {
        const token = localStorage.getItem('access_token') || '';
        const res = await fetch(API + 'add-message', {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                last_message: data.message,
                qued_timestamp: data.scheduled_time,
                image_url: null,
                phone_numbers: data.phone_numbers,
                created_at: new Date().toISOString()
            })
        });
        const json = await res.json();
        if (json.detail === "Could not validate credentials") {
            localStorage.removeItem('access_token');
        }
        return json;
    } catch (error) {
        console.log(error)
    }
}

export const updateMessage = async (messageId, messageData) => {
    try {
        const token = localStorage.getItem('access_token') || '';
        const res = await fetch(API +`update-message?message_id=${message_id}`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData)
        });
        const json = await res.json();
        if (json.detail === "Could not validate credentials") {
            localStorage.removeItem('access_token');
        }
        return json;    
    } catch (error) {
        console.error('Error updating message:', error);
        return null;
    }
};

