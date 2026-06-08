import Game from "../../../domain/model/Game";
import {ConnectedPlayerRepository} from "../../repository/ConnectedPlayerRepository";
import {ConnectedPlayer} from "../../model/ConnectedPlayer";
import {Server} from "socket.io";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";
import CookieManager from "../../application/CookieManager";

export class ConnectPlayerController {
    private game: Game;
    private connectedPlayersRepo: ConnectedPlayerRepository;
    private io: Server;

    constructor(game: Game, connectedPlayersRepo: ConnectedPlayerRepository, io: Server) {
        this.game = game;
        this.connectedPlayersRepo = connectedPlayersRepo;
        this.io = io;
    }

    public execute(nickname: string, socketId: string, cookies: string): void {
        try {
            const player = this.game.getPlayerByNickname(nickname);
            const id = CookieManager.parse(cookies).playerId;
            if (player && id) {
                const connectedPlayer = new ConnectedPlayer(player, socketId, id);
                this.connectedPlayersRepo.addConnectedPlayer(connectedPlayer);

                this.io.emit("update-players-data", {
                    players: PlayerMapper.map(this.game.players)
                })
            }
        } catch (err) {
            console.error(err);
        }
    }
}