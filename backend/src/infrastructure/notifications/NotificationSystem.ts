import {Server} from "socket.io";
import Player from "../../domain/model/Player";
import {ConnectedPlayerRepository} from "../repository/ConnectedPlayerRepository";

interface Message {
    message: string;
    time: number;
    isPrivate: boolean;
}

export class NotificationSystem {
    private io: Server;
    private connectedPlayerRepo: ConnectedPlayerRepository

    public constructor(io: Server, connectedPlayerRepo: ConnectedPlayerRepository) {
        this.io = io;
        this.connectedPlayerRepo = connectedPlayerRepo;
    }

    public sendMessageToAll(message: string): void {
        this.io.emit("message_to_all", {
            message: message,
            time: Date.now(),
            isPrivate: false,
        });
    }

    public sendPrivateMessageToPlayerById(message: string, player: Player): void {
        const connectedPlayer = this.connectedPlayerRepo.getConnectedPlayer(player);
        if (connectedPlayer) {
            this.io.to(connectedPlayer.socketId).emit(`private_message`, {
                message: message,
                time: Date.now(),
                isPrivate: true,
            })
        } else {
            console.log("connected player not found");
        }
    }
}