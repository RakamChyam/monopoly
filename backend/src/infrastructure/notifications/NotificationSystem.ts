import {Server} from "socket.io";

interface Message {
    message: string;
    time: number;
    isPrivate: boolean;
}

export class NotificationSystem {
    private socket: Server;

    public constructor(socket: Server) {
        this.socket = socket;
    }

    public sendMessageToAll(message: string): void {
        this.socket.emit("message_to_all", {
            message: message,
            time: Date.now(),
            isPrivate: false,
        });
    }
}