const API = import.meta.env.VITE_API_URL

export const sendSms = async (customer_id) => {
    try {
        const token = localStorage.getItem('access_token') || '';
        const res = await fetch(API+`send?customer_id=${customer_id}`, {
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