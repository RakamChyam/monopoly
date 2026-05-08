import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {PlayerBuyPropertyUseCase} from "../../../domain/use-cases/buy-property/PlayerBuyPropertyUseCase";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";
import {GameError} from "../../../domain/errors/GameError";

export class PlayerBuyPropertyController {
    private game: Game;
    private notificationSystem: NotificationSystem;
    private io: Server;
    private playerBuyPropertyUseCase: PlayerBuyPropertyUseCase;

    constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.playerBuyPropertyUseCase = new PlayerBuyPropertyUseCase(game);
    }

    public execute(data: { nickname: string }): void {
        try {
            const player = this.playerBuyPropertyUseCase.execute(data.nickname);
            const players = PlayerMapper.map(this.game.players)

            this.io.emit("update-players-data", {
                players: players,
            })

            this.notificationSystem.sendMessageToAll(`Игрок ${player.nickname} купил ${player.getLastProperty().name}`)
        } catch (err) {
            if (err instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(err.message, err.player)
            }
            console.error(err);
        }
    }
}