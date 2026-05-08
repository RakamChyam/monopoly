import Game from "../../../domain/model/Game";
import {Server} from "socket.io";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {PlayerActionUseCase} from "../../../domain/use-cases/do-action/PlayerActionUseCase";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";
import {GameError} from "../../../domain/errors/GameError";

export class PlayerActionController {
    private game: Game;
    private io: Server;
    private notificationSystem: NotificationSystem;
    private playerActionUseCase: PlayerActionUseCase;

    public constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.io = io;
        this.notificationSystem = notificationSystem;
        this.playerActionUseCase = new PlayerActionUseCase(game);
    }

    execute(data: { nickname: string }) {
        try {
            const player = this.playerActionUseCase.execute(data.nickname);
            const players = PlayerMapper.map(this.game.players)

            this.io.emit('update-players-data', {
                players: players,
            })

            this.notificationSystem.sendMessageToAll(`Игрок ${player.nickname} выполнил действие`)
        } catch (err) {
            if (err instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(err.message, err.player)
            }
            console.error(err);
        }

    }
}