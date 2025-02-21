const API = import.meta.env.VITE_WS_URL

export class WebSocketManager {
    socket;
    fns;

    constructor() {
        console.log("API: ", API)
        this.socket = new WebSocket(API);
        this.fns = {}

        this.socket.addEventListener("message", event => {
            const data = JSON.parse(event.data)
            
            if (this.fns[data.type]) {
                this.fns[data.type].forEach((item) => {
                    item.cb(data.data)
                })
            }
        });
    }

    addFns(key, cb, id) {
        if (this.fns[key]) {
            this.fns[key].push({ id, cb })
        } else {
            this.fns[key] = [{ id, cb }]
        }
    }

    removeFns(key, id) {
        if (this.fns[key]) {
            this.fns[key] = this.fns[key].filter((fn) => fn.id !== id)
        }
    }

    getSocket() {
        return this.socket;
    }

    closeSocket() {
        this.socket.close();
    }
}