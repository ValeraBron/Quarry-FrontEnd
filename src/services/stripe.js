const API = import.meta.env.VITE_API_URL


export const checkout =  async (data) => {
        
    try {
        const token = localStorage.getItem('access_token') || '';
        const res = await fetch(API+`checkout`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await res.json();
        console.log({json})
        if (json.detail === "Could not validate credentials") {
            localStorage.removeItem('access_token')
        }
        return json;
    } catch (error) {
        console.log(error)
    }
}


